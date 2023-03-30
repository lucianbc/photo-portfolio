import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React from "react";
import { Link } from "gatsby";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export const query = graphql`
  query Index {
    posts: allFile(
      filter: { childMdx: { id: { ne: null } } }
      sort: { childrenMdx: { frontmatter: { date: DESC } } }
    ) {
      nodes {
        childMdx {
          fields {
            slug
          }
          frontmatter {
            title
            banner {
              childImageSharp {
                gatsbyImageData(
                  aspectRatio: 1.33
                  formats: [AUTO, WEBP, AVIF]
                  width: 1504
                  quality: 90
                )
              }
            }
          }
        }
      }
    }
  }
`;

type Props = {
  data: DeepWriteable<Queries.IndexQuery>;
};

const Index = (props: Props) => {
  return (
    <>
      <Header />
      <AlbumsView albums={[...props.data.posts.nodes]} />
      <Footer />
    </>
  );
};

type Album = DeepWriteable<Queries.IndexQuery["posts"]["nodes"]>[number];

const AlbumsView = ({ albums }: { albums: Album[] }) => {
  return (
    <main className="container">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {React.Children.toArray(
          albums.slice(0).map((x) => {
            return <AlbumCard2 album={x} />;
          })
        )}
      </div>
    </main>
  );
};

const AlbumCard2 = ({ album }: { album: Album }) => {
  return (
    <article className="aspect-[4/3] relative w-100 h-100">
      <GatsbyImage
        image={getImage(album.childMdx?.frontmatter?.banner as any)!}
        alt="alt text"
      />
      <Link
        to={`${album.childMdx?.fields?.slug}`}
        className="group absolute top-0 bottom-0 left-0 right-0"
      >
        <div className="transition-all group-hover:opacity-100 opacity-0 absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.6)] text-white backgrop-blur-sm">
          <div className="flex justify-center items-center h-[100%]">
            <p className="translate-y-6 group-hover:translate-y-0 transition-all">
              {album.childMdx?.frontmatter.title}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default Index;
