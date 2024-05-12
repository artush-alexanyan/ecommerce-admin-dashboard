import { defineStore } from "pinia";
import BASE_URL from "@/backand/api";


export const useProductsFetchStore = defineStore("ProductsFetchStore", {
    state: () => ({
        products: [],
        productsLoading: false
    }),

    actions: {
        async getProducts() {
            try {
                this.productsLoading = true;
                const response = await BASE_URL.get("/products/get");
                const productData = response.data.products;
                this.products = productData;
                this.productsLoading = false;
            } catch (error) {
                this.productsLoading = false;
                console.error(error);
            }
        }
    },
});
