import axios from "axios";
import { LeafletMouseEvent } from "leaflet";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { Link, useHistory } from "react-router-dom";
import logo from "../../assets/logo.svg";
import api from "../../services/api";
import "./styles.css";
interface State {
  id: number;
  nome: string;
  sigla: string;
}

interface County {
  id: number;
  nome: string;
}

interface Item {
  id: number;
  title: string;
  image_url: string;
}

const CreatePoint = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [countys, setCountys] = useState<County[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    getItems();
    getStates();
  }, []);

  useEffect(() => {
    getCounty(selectedState);
  }, [selectedState]);

  const getItems = async () => {
    await api.get("items").then((response) => {
      setItems(response.data);
    });
  };

  const getStates = async () => {
    await axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((response) => {
        setStates(response.data);
      });
  };

  const getCounty = async (state: string) => {
    await axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
      )
      .then((response) => {
        setCountys(response.data);
      });
  };

  const mapClick = (event: LeafletMouseEvent) => {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  };

  const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const selectedItem = (id: number) => {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filtedItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filtedItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const { name, email, whatsapp } = formData;
    const uf = selectedState;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;
    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      longitude,
      latitude,
      items,
    };

    await api
      .post("points", data)
      .then((response) => {
        alert("Ponto de coleta criado com sucesso!");
        history.push("/");
      })
      .catch((error) => {
        alert(
          "Não foi possível cadastrar o ponto de coleta, verifique os dados e tente novamente."
        );
      });
  };

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          voltar para a home
        </Link>
      </header>
      <form onSubmit={submit}>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={inputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={inputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                value={formData.whatsapp}
                onChange={inputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={mapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedState}
                onChange={(event) => {
                  setSelectedState(event.target.value);
                }}
              >
                <option value="0">selecione um estado</option>
                {states.map((state) => (
                  <option value={state.sigla} key={state.id}>
                    {state.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={(event) => {
                  setSelectedCity(event.target.value);
                }}
              >
                <option value="0">selecione uma cidade</option>
                {countys.map((state) => (
                  <option value={state.nome} key={state.id}>
                    {state.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => selectedItem(item.id)}
                className={selectedItems.includes(item.id) ? "selected" : ""}
              >
                <img
                  src={`http://localhost:3333/${item.image_url}`}
                  alt={item.title}
                />
                {item.title}
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">Cadastar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
