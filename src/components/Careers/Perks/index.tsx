import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { FluidObject } from 'gatsby-image'

import { RightContent } from '../../UI/Layout'
import * as S from './styled'
import ADayAtSignifica from './ADayAtSignifica'
import Circle from './Circle'

interface IGallery {
  alt: string
  image: {
    childImageSharp: {
      fluid: FluidObject
      original: { width: number; height: number }
    }
  }
}

interface ISection {
  title: string
  text: string
  image: {
    publicURL: string
  }
}

interface ICareersPerks {
  careersYaml: {
    perks: {
      title: string
      list: ISection[]
      images: IGallery[]
    }
  }
}

const Perks: React.FC = () => {
  const {
    careersYaml: { perks },
  }: ICareersPerks = useStaticQuery(careersPerksQuery)

  const renderImages = (
    { image: { childImageSharp }, alt }: IGallery,
    i: number
  ) => (
    <S.GalleryImage
      width={childImageSharp.original.width}
      height={childImageSharp.original.height}
      alt={alt}
      key={i}
      fluid={childImageSharp.fluid}
    />
  )

  const renderPeeks = ({ title, text, image }: ISection) => (
    <div key={title}>
      <img src={image.publicURL} alt={title} />
      <S.SectionTitle as="h4">{title}</S.SectionTitle>
      <S.SectionText>{text}</S.SectionText>
    </div>
  )

  return (
    <S.Wrapper id="perky-perks">
      <S.Title>
        <S.HandleCircle>
          <Circle />
        </S.HandleCircle>

        <S.HandleLogo>
          <ADayAtSignifica />
        </S.HandleLogo>
      </S.Title>

      <S.Gallery>{perks.images.map(renderImages)}</S.Gallery>

      <RightContent amountColumn={4} title={perks.title}>
        <S.Section>{perks.list.map(renderPeeks)}</S.Section>
      </RightContent>
    </S.Wrapper>
  )
}

const careersPerksQuery = graphql`
  query CareersPerksQuery {
    careersYaml {
      perks {
        title
        list {
          title
          text
          image {
            publicURL
          }
        }
        images {
          alt
          image {
            childImageSharp {
              original {
                width
                height
              }
              fluid(maxWidth: 400) {
                ...GatsbyImageSharpFluid_noBase64
              }
            }
          }
        }
      }
    }
  }
`

export default Perks
