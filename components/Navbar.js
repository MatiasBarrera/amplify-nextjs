import Image from 'next/image'
import Link from 'next/link'
import { BurgerButton, CartButton } from './atoms/buttons'
import logo from '../public/ComeS-02Sinbajada-01.svg'
import { useEffect, useState } from 'react'
import { Icon } from '@material-ui/core'
import { useSelector } from 'react-redux'

const SCROLL_BREAK = 13

function Navbar() {
  const [show, setShow] = useState(false)
  const [isNavbarFixed, setIsNavbarFixed] = useState(false)

  useEffect(() => {
    const changePosition = () => {
      const { scrollY } = window

      scrollY > SCROLL_BREAK && !isNavbarFixed
        ? setIsNavbarFixed(true)
        : scrollY <= SCROLL_BREAK && isNavbarFixed && setIsNavbarFixed(false)
    }
    window.addEventListener('scroll', changePosition)
    return () => window.removeEventListener('scroll', changePosition)
  }, [isNavbarFixed])

  const handlerSlideUp = () => window.scrollTo(0, 0)
  // Se llama al state cart de redux
  const cart = useSelector((state) => state.cart)
  // se crea un estado para ir guardando la cantidad total de productos en el carrito
  const [qtyTotal, setQtyTotal] = useState(0)
  // variable que ejecuta la suma de las cantidades de cada producto en el carrito
  const totalItems = cart.reduce((a, c) => a + c.qty, 0)
  // cada vez que la cantidad en el carrito cambie, será capturado por el estado QtyTotal
  useEffect(() => {
    setQtyTotal(totalItems)
  }, [totalItems])

  return (
    <>
      <div className={isNavbarFixed ? 'navbar fixed-active' : 'navbar'}>
        <BurgerButton toggleMenu={(e) => setShow(e.target.checked)} />
        <div className="logo">
          <Image src={logo} alt="logo" width={'120px'} height={'40px'} layout="responsive" sizes="50vw" priority />
        </div>
        <div className={`background ${show ? 'show' : ''}`}></div>
        <div className={`content ${show ? 'show' : ''}`}>
          <ul>
            <li>
              <Link href="/">
                <a>Inicio</a>
              </Link>
              <hr />
            </li>
            <li>
              <Link href="/catalogo">
                <a>Catálogo</a>
              </Link>
              <hr />
            </li>
          </ul>
        </div>
        <CartButton qtyTotal={qtyTotal} />
        <span className="go-up" onClick={handlerSlideUp}>
          <Icon>keyboard_arrow_up</Icon>
        </span>
      </div>
      <style jsx>
        {`
          .logo {
            width: 6rem;
          }
          .background {
            position: fixed;
            height: 100vh;
            width: 100%;
            top: 0;
            left: 0;
            backdrop-filter: blur(4px);
            display: none;
            z-index: 10;
          }
          .content {
            position: fixed;
            top: 0;
            left: 0;
            width: 60%;
            height: 100%;
            background-color: var(--light);
            box-shadow: 0 0px 12px #00000055;
            border-radius: 0 12px 12px 0;
            margin: 0 -80%;
            transition: all 0.3s;
            z-index: 10;
          }
          .background.show {
            animation: showBackground 0.3s linear forwards;
            display: block;
          }
          .background.hide {
            animation: showBackground 0.3s reverse forwards;
            display: none;
          }
          .content.show {
            margin: 0 0px;
          }
          .navbar {
            height: 60px;
            width: 100%;
            padding: 0 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            background-color: #fff;
            z-index: 10;
            box-shadow: 1px 2px 10px -6px rgb(0 0 0 / 0%);
            transition: box-shadow 0.2s linear;
          }

          .go-up {
            display: ${isNavbarFixed ? 'block' : 'none'};
            padding: 10px;
            background: #7b61ff;
            color: #fff;
            cursor: pointer;
            position: fixed;
            bottom: 20px;
            right: 82%;
            border-radius: 10px;
            animation: showGoUp 0.3s linear forwards;
          }

          .fixed-active {
            background-color: #fff;
            box-shadow: 1px 2px 10px -6px rgb(0 0 0 / 15%);
          }

          ul {
            padding: 0;
            padding-top: 80px;
            margin: 0;
            list-style: none;
          }

          li {
            padding: 0 0.5rem;
          }
          a {
            display: inline-block;
            width: 100%;
            text-align: center;
            padding: 1rem 0;
            transition: all 0.3s;
          }
          hr {
            width: 70%;
            border: none;
            border-bottom: 1px solid var(--light-gray);
            margin: auto;
            transition: all 0.3s;
          }
          a:hover {
            color: var(--dark-green);
            padding: 1.5rem 0;
          }
          a:hover ~ hr {
            width: 90%;
          }

          @keyframes showBackground {
            from {
              display: none;
              background-color: transparent;
            }
            to {
              display: block;
              background-color: #00000055;
            }
          }

          @keyframes hideBackground {
            from {
              background-color: #00000055;
            }
            to {
              background-color: transparent;
            }
          }

          @keyframes showGoUp {
            from {
              display: none;
              background-color: transparent;
            }
            to {
              display: block;
              background-color: #7b61ff;
            }
          }

          @media (min-width: 800px) {
            .navbar {
              padding: 0.5rem 3rem;
              align-items: flex-start;
              height: auto;
            }

            .go-up {
              display: ${isNavbarFixed ? 'block' : 'none'};
              padding: 1rem;
              color: #fff;
              cursor: pointer;
              position: fixed;
              bottom: 20px;
              right: 15px;
              animation: showGoUp 0.3s linear forwards;
            }

            .background {
              display: none;
            }

            .background.show {
              display: none;
            }

            .fixed-active {
              box-shadow: 1px 2px 10px -6px rgb(0 0 0 / 15%);
              z-index: 10;
            }

            .logo {
              width: 10rem;
            }

            .content {
              position: static;
              display: flex;
              margin: 0;
              background: transparent;
              width: 100%;
              box-shadow: none;
              justify-content: space-around;
            }

            ul {
              padding: 0;
              margin: 0;
              list-style: none;
              display: flex;
              justify-content: flex-end;
              width: 100%;
            }

            a {
              padding: 1rem;
            }
            a:hover {
              padding: 1rem;
            }
          }
        `}
      </style>
    </>
  )
}

export default Navbar
