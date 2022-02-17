export default async function productsHandler(req, res) {
  const { skip } = req.query
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/product/products?skip=${skip}&take=12`)
    const { data, message } = await response.json()

    if (message) res.status(200).send({ message })

    res.status(200).send({ data })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
