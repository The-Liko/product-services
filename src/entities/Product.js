import { Schema, model } from "mongoose";

/* 
  Product schema
*/
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sells: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value >= 0;
      },
      message: (props) =>
        `${props.value} is not a valid positive number for price.`,
    },
  },
  quantity: {
    type: Number,
    default: 1,
    validate: {
      validator: function (value) {
        return value >= 0;
      },
      message: (props) =>
        `${props.value} is not a valid positive number for price.`,
    },
  },
  imgUrl: {
    type: String,
    required: true,
  },
  price: {
    value: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: (props) =>
          `${props.value} is not a valid positive number for price.`,
      },
    },
    currency: {
      type: String,
      required: true,
    },
  },
  details: {
    type: Object,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const Product = model("Product", productSchema);
export default Product;
