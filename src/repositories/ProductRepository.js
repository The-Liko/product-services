import Product from "../entities/Product.js";

export class ProductRepository {
  async create(productData) {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  }

  async update(id, productData, isNew) {
    return await Product.findByIdAndUpdate(id, productData, { new: isNew });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }

  async find(query, skip, limit, sortQuery) {
    return await Product.find(query).skip(skip).limit(limit).sort(sortQuery);
  }

  async count(query) {
    return await Product.countDocuments(query);
  }

  async findById(id) {
    return await Product.findById(id).populate("items");
  }
}
