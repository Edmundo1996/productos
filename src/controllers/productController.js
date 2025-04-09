import Product from "../models/productModel.js";
import { Op } from "sequelize";

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).json({ message: "Error al listar productos" });
  }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  const { nombre, precio, categorias } = req.body;

  // Validaciones
  if (!nombre || !precio || !categorias) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  if (precio < 0) {
    return res.status(400).json({ message: "El precio no puede ser negativo." });
  }

  try {
    // Verificar si ya existe un producto con el mismo nombre
    const existingProduct = await Product.findOne({ where: { nombre } });

    if (existingProduct) {
      return res.status(400).json({ message: "El producto ya existe." });
    }

    // Crear el producto
    const product = await Product.create({
      nombre,
      precio,
      categorias,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: "Error al crear producto" });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categorias } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "El producto no existe." });
    }

    // Actualizar solo los campos proporcionados
    const updatedProductData = {
      nombre: nombre || product.nombre,
      precio: precio !== undefined ? precio : product.precio,
      categorias: categorias || product.categorias,
    };

    await product.update(updatedProductData);

    res.status(200).json(product);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

// Eliminar un producto (cambiar su estado a inactivo)
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "El producto no existe." });
    }

    await product.destroy(); // Elimina el producto de la base de datos

    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};