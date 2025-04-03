import {
  convertToCurrency,
  getProductsWithNewCurrency,
} from "../methods/changeCurrency.js";
import { getSortTypeField } from "../methods/sort.js";
import { generatePagination } from "../methods/paginate.js";
import { getFiltersQuery } from "../methods/filter.js";

export class ProductController {
  productRepository;

  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  onCreateProduct = async (req, res) => {
    try {
      const newProduct = this.productRepository.create(req.body);
      return res.status(201).json(newProduct);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  onUpdateProduct = async (req, res) => {
    const { id } = req.params;
    try {
      const updatedProduct = await this.productRepository.find(
        id,
        req.body,
        true
      );
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.status(200).json(updatedProduct);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  onDeleteProductById = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedProduct = await this.productRepository.delete(id);
      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  onUpdateAvailability = async (req, res) => {
    try {
      const { productId } = req.params.id;
      const { availability } = req.body;
      const updateAvailability = await this.productRepository.find(
        productId,
        { availability },
        false
      );
      if (!updateAvailability) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(updateAvailability);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  onGetProducts = async (req, res) => {
    const {
      page = 1,
      limit = 6,
      sort = -5,
      ft1 = "0_-1_1",
      ft2 = "0_-1_1",
      ft3 = "0_-1_1",
      search = "",
      newCurrency = "USD",
    } = req.query;
    try {
      const startIndex = (page - 1) * limit;
      const sortWay = getSortTypeField(sort);
      const filters = getFiltersQuery(ft1, ft2, ft3);

      let query = { availability: true, deleted: false };
      query.quantity = { $gte: 1 };

      if (search) {
        query.name = { $regex: new RegExp(search, "i") };
      }
      const products = await this.productRepository.find(
        filters.length > 0 ? { $and: filters, ...query } : query,
        startIndex,
        limit,
        {
          [sortWay]: sort >= 0 ? 1 : -1,
        }
      );

      const totalProductsCount = await this.productRepository.count(query);
      const pagination = generatePagination(page, limit, totalProductsCount);

      res.status(200).json({
        products: getProductsWithNewCurrency(
          products,
          newCurrency,
          ft1,
          ft2,
          ft3
        ),
        pagination,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  onGetProduct = async (req, res) => {
    const { newCurrency = "USD", admin = false } = req.query;

    try {
      const productId = request.params.id;
      const product = this.productRepository.findById(productId);
      if (!product) {
        response.status(404).json({ error: "Product not found" });
      } else if ((!product.availability && !admin) || product.deleted) {
        response.status(403).json({
          message:
            "Cannot retrieve the product. It is not available or has been deleted.",
        });
      } else {
        const convertedPrice = convertToCurrency(
          product._doc.price.value,
          product._doc.price.currency,
          newCurrency
        );

        res.status(200).json({
          ...product._doc,
        });
      }
    } catch (error) {
      response.status(500).json({ error: "Internal Server Error" + error });
    }
  };
}
