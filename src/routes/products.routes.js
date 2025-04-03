import { Router } from "express";
import { ProductController } from "../controllers/ProductController.js";
import { ProductRepository } from "../repositories/ProductRepository.js";

const productRouter = Router();
const productRepository = new ProductRepository();
const productController = new ProductController(productRepository);

productRouter.get("/products", productController.onGetProducts);

productRouter.get("/products/:id", productController.onGetProduct);

productRouter.post("/products", productController.onCreateProduct);

productRouter.put("/products/:id", productController.onUpdateProduct);

productRouter.delete("/products/:id", productController.onDeleteProductById);

productRouter.patch("/products/:id", productController.onUpdateAvailability);

export default productRouter;
