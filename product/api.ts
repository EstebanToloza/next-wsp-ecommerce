import { Product } from "./types";
import axios from "axios";
import Papa from "papaparse";


// eslint-disable-next-line import/no-anonymous-default-export
export default {
    list: async (): Promise<Product[]> => {
        return axios.get(
            `${process.env.NEXT_PUBLIC_PRODUCTS_LIST}`,
            {
                responseType: 'blob'
            }
        ).then(
            (response) => 
                new Promise<Product[]>((resolve, reject) => {
                Papa.parse(response.data, {
                    header: true,
                    complete: results => {
                        const products = results.data as Product[];
                        return resolve(products.map(product => ({
                            ...product,
                            price: Number(product.price)
                        })))
                    },
                    error: (error) => reject(error.message),
                });
            })
        )
    }
}