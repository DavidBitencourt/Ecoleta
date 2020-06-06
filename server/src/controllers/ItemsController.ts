import { Request, Response } from "express";
import knex from "../database/connection";

class ItemsControllers {
  async index(request: Request, response: Response) {
    const items = await knex("items").select("*");
    const serializedItems = await items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        image_url: `uploads/${item.image}`,
      };
    });
    return response.json(serializedItems);
  }
}

export default ItemsControllers;
