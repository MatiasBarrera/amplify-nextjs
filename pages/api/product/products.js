export default async function productHandler(req, res) {
  const { skip } = req.query
  console.log(skip)
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/product/products?skip=${skip}&take=12`)
    const { data } = await response.json()
    res.status(200).send({ data })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
