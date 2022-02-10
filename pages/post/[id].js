import Link from "next/link";

export const getStaticPaths = async () => {
  const response = await fetch(process.env.API_FETCH);
  const posts = await response.json();

  const paths = posts.map((post) => {
    return {
      params: { id: post.id.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const response = await fetch(
    `${process.env.API_FETCH}/${params.id.toString()}`
  );

  const post = await response.json();

  return {
    props: { post },
  };
};

export default function Post({ post }) {
  return (
    <div className="container">
      <Link href={"/"}>
        <a> 🔙 Back</a>
      </Link>
      <h1>{post.title}</h1>
      <style jsx>{`
        .container {
          padding: 10rem;
        }
        h1 {
          color: rgb(255, 94, 0);
        }

        a {
          color: rgb(53, 53, 194);
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
