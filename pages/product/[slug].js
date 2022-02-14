import Image from 'next/image'
import Link from 'next/link'
import QtyBox from '../../components/atoms/QtyBox'
import QtyAddProduct from '../../components/QtyAddCart'
import Badge from '../../components/atoms/Badge'
import Icon from '@material-ui/core/Icon'
import priceFormat from '../../helpers/priceFormat'
import { useRouter } from 'next/router'
import Loader from '../../components/Loader'
import { useSelector } from 'react-redux'
import purchaseFormat from '../../helpers/purchaseFormat'

export const getStaticPaths = async () => {
  const response = await fetch(`${process.env.API_URL}/api/v1/product/products`)
  const { data: products } = await response.json()
  const paths = products.map((product) => {
    return {
      params: { slug: product.slug },
    }
  })
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async ({ params }) => {
  const resProducts = await fetch(`${process.env.API_URL}/api/v1/product/products`)
  const { data: products } = await resProducts.json()
  const { slug } = params

  const { ID_product } = products.filter((product) => product.slug == slug)[0]
  const resProduct = await fetch(`${process.env.API_URL}/api/v1/product/${ID_product}`)
  const { data } = await resProduct.json()
  const { product } = data
  return {
    props: { product },
    revalidate: 1,
  }
}

function ProductInfo({ product }) {
  const { producers } = useSelector((state) => state)
  const producer = producers.find((producer) => producer.producerInfo.ID_producer == product.producer.ID_producer)

  const router = useRouter()
  return router.isFallback ? (
    <Loader />
  ) : (
    <>
      <div className="container">
        <div className="product-summary">
          <div className="img">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGES_PATH}/${
                product.image[0] ? product.image[0].file_image : 'imagen_no_disponible.jpg'
              }`}
              alt=""
              layout="fill"
              objectFit="cover"
              objectPosition={'center'}
              className="bradius-1"
              priority
            />
          </div>
          <div className="short-info">
            <div>
              <h1>{product.name}</h1>
              <div>
                <Link href="#">
                  <a className="links">{product.producer.brand_name}</a>
                </Link>
              </div>
            </div>
            <hr />
            <div className="element-block">
              <div className="price-element">
                <p>
                  Precio por caja <br className="mobile" />
                  <span className="desktop">iva incluido</span>
                  <span className="small mobile">iva incluido</span>
                </p>
                <p className="secondary impact">{priceFormat(product.price_package)}</p>
              </div>
              <div className="price-element right">
                <p>Precio unidad al por mayor</p>
                <p className="secondary impact">{priceFormat(product.wholesale_unit_price)}</p>
              </div>
            </div>
            {product.suggested_sale_price != 0 && (
              <div className="element-block">
                <div className="price-element right">
                  <p>Precio sugerido de venta</p>
                  <p className="secondary low-impact">{priceFormat(product.suggested_sale_price)} </p>
                </div>
              </div>
            )}
            <div className="element-block">
              <div>
                <p>Duración: {product.duration ? <span className="primary"> {product.duration} meses</span> : ''}</p>
              </div>
              <div className="right row">
                <p style={{ paddingRight: '1rem' }}>Formato:</p>
                <QtyBox product={product} padding="0"></QtyBox>
              </div>
            </div>
            <div className="element-block">
              <p>
                Tiempo estimado de entrega:
                {product.delivery_time ? <span className="primary"> {product.delivery_time} días</span> : ''}
              </p>
            </div>
            <hr />
            {producer ? (
              producer.remaining !== 0 && (
                <div className="remainingProducts">
                  <p>
                    Te faltan {purchaseFormat(producer.remaining, producer.producerInfo.type_sale.type)} para cumplir
                    con el pedido mínimo del productor
                  </p>
                  <Link href="/catalogo">
                    <a className="links">ver más del productor</a>
                  </Link>
                </div>
              )
            ) : (
              <div className="remainingProducts">
                <p>
                  El pedido mínimo para este productor es de{' '}
                  {purchaseFormat(product.producer.min_producer_purchase, product.producer.type_sale.type, true)} <br />
                </p>
                <Link href="/catalogo">
                  <a className="links">ver más del productor</a>
                </Link>
              </div>
            )}
            <div className="element-block">
              <p className="add-cart mobile">Agregar al carrito:</p>

              <QtyAddProduct product={product} />
              <Icon className="desktop gray">share</Icon>
            </div>
            <hr className="desktop" />
            <div className="element-block">
              <div className="categories">
                <p>Categorías: </p>
                <Badge value="Limonada" />
                <Badge value="Bebestibles" />
                <Badge value="Condimentos" />
                <Badge value="Café" />
                <Badge value="Té" />
              </div>
            </div>
          </div>
        </div>
        <div className="product-description">
          {product.description && (
            <details open>
              <summary>
                <h2>Descripción</h2>
              </summary>
              <div className="details-content">
                <p>{product.description}</p>
              </div>
            </details>
          )}
          {product.benefit && (
            <details>
              <summary>
                <h2>Usos y Beneficios</h2>
              </summary>{' '}
              {/* ocultar cuando no haya información */}
              <div className="details-content">
                <p>{product.benefit}</p>
              </div>
            </details>
          )}
          {product.conservation && (
            <details>
              <summary>
                <h2>Modo de conservación</h2>
              </summary>
              <div className="details-content">
                <p>{product.conservation}</p>
              </div>
            </details>
          )}
        </div>
        <div className="categories mobile">
          <p>Categorías: </p>
          <Badge value="Limonada" />
          <Badge value="Bebestibles" />
          <Badge value="Condimentos" />
          <Badge value="Café" />
          <Badge value="Té" />
        </div>
      </div>
      <style jsx>
        {`
          .container {
            width: 90%;
            margin: 1.5rem auto;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            padding-bottom: 4rem;
          }

          .product-summary {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .short-info {
            display: inherit;
            flex-direction: column;
            gap: 1rem;
          }

          .img {
            position: relative;
            aspect-ratio: 1/1;
          }

          .element-block {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1.5rem;
          }
          .element-block div {
            flex: 2;
          }

          .element-block p {
            margin: 0;
          }

          .price-element {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            align-self: flex-start;
          }

          .secondary {
            color: var(--secondary);
          }

          .impact {
            font-size: 1.5rem;
          }

          .low-impact {
            font-size: 1.375rem;
          }

          h1 {
            margin: 0;
            margin-bottom: 0.5rem;
          }

          .right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            flex: 1;
            text-align: right;
          }

          .row {
            flex-direction: row;
          }

          .right.row {
            align-items: center;
            justify-content: flex-end;
            gap: 0.5rem;
          }

          .small {
            font-size: 0.875rem;
          }

          summary h2 {
            display: inline-block;
          }
          summary::marker {
            content: '';
          }
          summary::after {
            content: ' ▶';
            display: inline-block;
            margin-left: 0.5rem;
            transition: all 0.2s;
            transform-origin: center;
            position: absolute;
            top: 25%;
            right: 1rem;
            color: var(--gray);
          }

          summary {
            background-color: #eee;
            padding: 0.5rem;
            position: relative;
          }

          summary:hover {
            background-color: #e5e5e5;
          }

          details {
            border: 1px solid var(--light-gray);
          }

          details:first-child {
            border-radius: 0.5rem 0.5rem 0rem 0rem;
          }

          details:last-child {
            border-radius: 0 0 0.5rem 0.5rem;
          }

          details:only-of-type {
            border-radius: 0.5rem;
          }

          .details-content {
            padding: 0.5rem;
          }

          details[open] summary::after {
            transform: rotate(90deg);
          }

          hr {
            width: 100%;
            margin: 0;
            border: none;
            border-bottom: 1px solid var(--light-gray);
          }

          .add-cart {
            font-size: 1.25rem;
          }

          .categories {
            display: none;
            flex-wrap: wrap;
            gap: 0.75rem;
            justify-content: flex-start;
            align-items: center;
          }

          .mobile {
            display: flex;
          }

          .desktop {
            display: none;
          }

          .categories p {
            margin: 0;
          }

          .remainingProducts {
            width: 100%;
            background-color: #ffffe3;
            text-align: center;
            padding: 0.5rem;
            border-radius: 0.5rem;
          }

          .remainingProducts p {
            margin: 0;
            display: inline;
          }

          .remainingProducts .links {
            margin-left: 0.5rem;
            display: inline;
          }

          @media (min-width: 600px) {
            .container {
              width: 70%;
              padding-bottom: 4rem;
            }

            .product-summary {
              flex-direction: row;
              gap: 2rem;
            }

            .img {
              flex: 2;
              height: inherit;
              aspect-ratio: auto;
            }

            .short-info {
              flex: 3;
            }

            .categories {
              display: flex;
            }

            .categories p {
              font-size: 1.25rem;
              width: 100%;
            }

            .mobile {
              display: none;
            }
            .desktop {
              display: flex;
            }
            span.desktop {
              display: inline;
            }
          }
        `}
      </style>
    </>
  )
}
export default ProductInfo
