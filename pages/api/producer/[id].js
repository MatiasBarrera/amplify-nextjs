export default async function ProducerWithProductsHandler(req, res) {
  const { skip, id } = req.query
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/producer/${id}?skip=${skip}&take=12`)
    const { producer, productCount, products, message } = await response.json()

    if (message) res.status(200).send({ message })

    res.status(200).send({ data: { producer, productCount, products } })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
