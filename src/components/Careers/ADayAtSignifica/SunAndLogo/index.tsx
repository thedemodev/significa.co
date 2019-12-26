import React from 'react'

import { ThemeContext } from '@theme'

import * as S from './styled'

type ThemeType = 'light' | 'dark'

const SUN_START_RADIUS = 5
const SUN_END_RADIUS = 13

const SunAndLogo = () => {
  const { updateTheme } = React.useContext(ThemeContext)

  // Refs for the sun and sun path
  const pathRef = React.useRef<SVGPathElement>(null)
  const circleRef = React.useRef<SVGCircleElement>(null)

  const [currentTheme, setCurrentTheme] = React.useState<ThemeType>('light')
  const [shouldAnimate, setShouldAnimate] = React.useState(true)

  // When our local state theme changes, we need to update the theme context
  React.useEffect(() => {
    updateTheme(currentTheme)
  }, [currentTheme, updateTheme])

  // Toggle handler to change between themes
  const handleToggle = React.useCallback(() => {
    if (!circleRef.current) {
      return null
    }

    const circleX = circleRef.current.cx.baseVal.value
    const isNightNow = currentTheme === 'dark'

    circleRef.current.setAttribute(
      'cx',
      String(isNightNow ? circleX + 22 : circleX - 22)
    )
    return setCurrentTheme(isNightNow ? 'light' : 'dark')
  }, [currentTheme])

  const handleScroll = React.useCallback(() => {
    if (!pathRef.current || !circleRef.current) {
      return null
    }

    const pathBounding = pathRef.current.getBoundingClientRect()
    // get distance from path in center of window to window top
    const pathToTop = (pathBounding.top - window.outerHeight / 2) * -1
    const pathHeight = pathBounding.height
    const percentage = (pathToTop * 100) / pathHeight

    // get the percentage of how much of the path is visible to the center of the window (capped between 0 and 100)
    const pathPercentageInView = Math.max(Math.min(percentage, 100), 0) / 100

    const pathLength = pathRef.current.getTotalLength()
    const pathPercentage = pathLength * pathPercentageInView
    const circleCoordinates = pathRef.current.getPointAtLength(pathPercentage)

    pathRef.current.style.strokeDasharray = pathLength.toString()
    pathRef.current.style.strokeDashoffset = (
      pathLength - pathPercentage
    ).toString()

    const radiusDiff = SUN_END_RADIUS - SUN_START_RADIUS
    circleRef.current.setAttribute(
      'r',
      String(SUN_START_RADIUS + pathPercentageInView * radiusDiff)
    )
    circleRef.current.setAttribute('cx', String(circleCoordinates.x))
    circleRef.current.setAttribute('cy', String(circleCoordinates.y))

    if (pathPercentageInView >= 1) {
      setCurrentTheme('dark')
      return setShouldAnimate(false)
    }

    return null
  }, [])

  // Add a scroll listener to make the sun move
  React.useEffect(() => {
    if (shouldAnimate) {
      handleScroll()
      window.addEventListener('scroll', handleScroll)
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll, shouldAnimate])

  return (
    <S.Svg
      animationEnded={!shouldAnimate}
      width={1280}
      height={1048}
      viewBox="0 0 1280 1048"
      preserveAspectRatio="xMinYMax meet"
    >
      <S.Path>
        <mask id="dash-mask">
          <path
            id="dash-mask"
            d="M12.0639028,0 C436.127049,81.5751183 756.487326,454.702388 756.487326,902.671656"
            stroke="white"
            strokeDasharray="2,8"
            strokeWidth="1"
          />
        </mask>

        <path
          ref={pathRef}
          strokeWidth="1"
          strokeMiterlimit="10"
          strokeDasharray={0}
          strokeDashoffset={0}
          d="M12.0639028,0 C436.127049,81.5751183 756.487326,454.702388 756.487326,902.671656"
          stroke="currentColor"
          mask="url(#dash-mask)"
        />

        <S.LittleCircle r="3" strokeWidth="2" cy="0" cx="12" />
      </S.Path>

      <S.Toggle onClick={handleToggle}>
        <rect
          x="740.5"
          y="886.5"
          width="54"
          height="32"
          fill="currentColor"
          ry="16"
          rx="16"
        />

        <S.Sun
          ref={circleRef}
          cx="0"
          cy="0"
          r={SUN_START_RADIUS}
          stroke="none"
          fill="currentColor"
          x="0"
          y="0"
        />
      </S.Toggle>

      <S.Logo
        fill="currentColor"
        d="M86.5753066,1005.23911 L77.1977105,977.608697 L33.9937858,977.608697 L24.7836468,1005.23911 L0,1005.23911 L43.0364677,889.86119 L68.1550286,889.86119 L111.024039,1005.23911 L86.5753066,1005.23911 Z M40.8595258,957.346391 L70.1645135,957.346391 L55.4282911,913.975009 L40.8595258,957.346391 Z M207.479313,885.507307 L229.41619,885.507307 L229.41619,1005.23911 L207.479313,1005.23911 L207.479313,995.526603 C201.95323,1003.22963 191.06852,1006.74623 182.360752,1006.74623 C162.265904,1006.74623 144.013083,991.172719 144.013083,966.054159 C144.013083,940.935598 162.265904,925.36209 182.360752,925.36209 C191.403434,925.36209 201.95323,928.711231 207.479313,936.581714 L207.479313,885.507307 Z M186.547179,986.316464 C197.264432,986.316464 206.809485,977.943611 206.809485,966.054159 C206.809485,953.997249 196.762061,945.95931 186.547179,945.95931 C175.495012,945.95931 166.284873,954.49962 166.284873,966.054159 C166.284873,977.441239 175.495012,986.316464 186.547179,986.316464 Z M306.111529,927.204118 L328.048406,927.204118 L328.048406,1005.23911 L306.111529,1005.23911 L306.111529,995.526603 C300.585446,1003.22963 289.700736,1006.74623 280.992968,1006.74623 C260.898119,1006.74623 242.645298,991.172719 242.645298,966.054159 C242.645298,940.935598 260.898119,925.36209 280.992968,925.36209 C290.03565,925.36209 300.585446,928.711231 306.111529,936.581714 L306.111529,927.204118 Z M285.179395,986.316464 C295.896648,986.316464 305.441701,977.943611 305.441701,966.054159 C305.441701,953.997249 295.394276,945.95931 285.179395,945.95931 C274.127228,945.95931 264.917089,954.49962 264.917089,966.054159 C264.917089,977.441239 274.127228,986.316464 285.179395,986.316464 Z M396.370891,927.204118 L419.982339,927.204118 L371.754702,1043.58678 L348.310711,1043.58678 L366.730989,997.871002 L335.918888,927.204118 L360.032706,927.204118 L378.452984,972.25007 L396.370891,927.204118 L396.370891,927.204118 Z M520.289125,927.204118 L542.226002,927.204118 L542.226002,1005.23911 L520.289125,1005.23911 L520.289125,995.526603 C514.763042,1003.22963 503.878332,1006.74623 495.170564,1006.74623 C475.075715,1006.74623 456.822895,991.172719 456.822895,966.054159 C456.822895,940.935598 475.075715,925.36209 495.170564,925.36209 C504.213246,925.36209 514.763042,928.711231 520.289125,936.581714 L520.289125,927.204118 L520.289125,927.204118 Z M499.356991,986.316464 C510.074244,986.316464 519.619297,977.943611 519.619297,966.054159 C519.619297,953.997249 509.571872,945.95931 499.356991,945.95931 C488.304824,945.95931 479.094685,954.49962 479.094685,966.054159 C479.094685,977.441239 488.304824,986.316464 499.356991,986.316464 Z M606.194603,927.204118 L606.194603,944.117282 L589.616353,944.117282 L589.616353,1005.23911 L567.679477,1005.23911 L567.679477,944.117282 L553.445626,944.117282 L553.445626,927.204118 L567.679477,927.204118 L567.679477,898.568958 L589.616353,898.568958 L589.616353,927.204118 L606.194603,927.204118 L606.194603,927.204118 Z M689.92314,1006.74623 C665.30695,1006.74623 648.393786,991.675091 648.393786,971.245328 L671.670319,971.245328 C671.837776,979.618181 679.875715,986.483921 690.592968,986.483921 C700.975307,986.483921 707.841047,981.125295 707.841047,972.919898 C707.841047,966.55653 703.152249,962.035189 693.272281,959.020961 L679.205887,955.001992 C653.919869,948.303709 649.398528,933.065115 649.398528,922.682777 C649.398528,902.085557 667.148978,888.354077 689.253312,888.354077 C711.022731,888.354077 727.768438,901.583185 727.768438,923.520062 L704.491905,923.520062 C704.491905,915.314665 698.798365,908.951297 688.75094,908.951297 C679.708258,908.951297 672.842518,914.47738 672.842518,922.180405 C672.842518,925.027176 673.679804,931.05563 685.736713,934.404772 L698.630908,938.088827 C716.046443,942.945082 731.285037,952.155221 731.285037,971.747699 C731.285037,994.689318 711.692559,1006.74623 689.92314,1006.74623 L689.92314,1006.74623 Z M744.514146,1005.23911 L744.514146,927.204118 L766.451022,927.204118 L766.451022,1005.23911 L744.514146,1005.23911 Z M843.146361,927.204118 L865.083238,927.204118 L865.083238,994.521861 C865.083238,1028.6831 847.835159,1044.59153 820.204742,1044.59153 C803.459035,1044.59153 788.89027,1035.21393 782.191987,1020.81262 L800.444808,1012.94214 C803.793949,1019.97534 811.831889,1024.99905 820.204742,1024.99905 C834.271137,1024.99905 843.146361,1017.29602 843.146361,996.86626 L843.146361,995.69406 C837.452821,1003.22963 826.735568,1006.74623 818.0278,1006.74623 C797.932952,1006.74623 779.680131,991.172719 779.680131,966.054159 C779.680131,940.935598 797.932952,925.36209 818.0278,925.36209 C826.903025,925.36209 837.452821,928.878688 843.146361,936.414257 L843.146361,927.204118 Z M822.214227,986.316464 C832.93148,986.316464 842.476533,977.943611 842.476533,966.054159 C842.476533,953.997249 832.429109,945.95931 822.214227,945.95931 C811.162061,945.95931 801.951922,954.49962 801.951922,966.054159 C801.951922,977.441239 811.162061,986.316464 822.214227,986.316464 Z M928.382011,925.194633 C948.811774,925.194633 959.529027,938.926113 959.36157,962.370103 L959.36157,1005.23911 L937.424693,1005.23911 L937.424693,964.714502 C937.424693,952.322679 930.056582,946.796595 922.521014,946.796595 C914.650531,946.796595 904.938021,950.983022 904.938021,965.216873 L904.938021,1005.23911 L883.001145,1005.23911 L883.001145,927.204118 L904.938021,927.204118 L904.938021,940.265769 C908.287163,929.715974 920.678986,925.194633 928.382011,925.194633 Z M987.159444,913.305181 C979.623876,913.305181 973.260507,907.444183 973.260507,900.076072 C973.260507,892.707961 979.623876,887.01442 987.159444,887.01442 C994.862469,887.01442 1001.05838,892.707961 1001.05838,900.076072 C1001.05838,907.444183 994.862469,913.305181 987.159444,913.305181 Z M976.274734,1005.23911 L976.274734,927.204118 L998.211611,927.204118 L998.211611,1005.23911 L976.274734,1005.23911 Z M1062.51513,905.937069 C1049.95585,905.937069 1045.93688,912.802809 1045.76942,922.180405 L1045.76942,927.204118 L1062.85004,927.204118 L1062.85004,944.117282 L1045.76942,944.117282 L1045.76942,1005.23911 L1023.83254,1005.23911 L1023.83254,944.117282 L1009.09632,944.117282 L1009.09632,927.204118 L1023.83254,927.204118 L1023.83254,922.347863 C1023.83254,898.903872 1035.88945,885.507307 1058.16124,885.507307 L1067.53884,885.507307 L1067.53884,905.937069 L1062.51513,905.937069 Z M1089.1408,913.305181 C1081.60523,913.305181 1075.24186,907.444183 1075.24186,900.076072 C1075.24186,892.707961 1081.60523,887.01442 1089.1408,887.01442 C1096.84383,887.01442 1103.03974,892.707961 1103.03974,900.076072 C1103.03974,907.444183 1096.84383,913.305181 1089.1408,913.305181 Z M1078.25609,1005.23911 L1078.25609,927.204118 L1100.19297,927.204118 L1100.19297,1005.23911 L1078.25609,1005.23911 Z M1156.12363,1006.74623 C1133.34947,1006.74623 1113.25462,990.670348 1113.25462,965.886701 C1113.25462,941.103055 1133.34947,925.194633 1156.12363,925.194633 C1170.35748,925.194633 1181.74456,931.892916 1189.11267,941.94034 L1172.70188,953.494878 C1169.18528,948.638623 1162.65446,945.624396 1156.29109,945.624396 C1143.89926,945.624396 1135.52641,954.49962 1135.52641,965.886701 C1135.52641,977.441239 1143.89926,986.316464 1156.29109,986.316464 C1162.65446,986.316464 1169.18528,983.302237 1172.70188,978.445982 L1189.11267,990.00052 C1181.74456,1000.2154 1170.35748,1006.74623 1156.12363,1006.74623 Z M1257.93753,927.204118 L1279.87441,927.204118 L1279.87441,1005.23911 L1257.93753,1005.23911 L1257.93753,995.526603 C1252.41145,1003.22963 1241.52674,1006.74623 1232.81897,1006.74623 C1212.72412,1006.74623 1194.4713,991.172719 1194.4713,966.054159 C1194.4713,940.935598 1212.72412,925.36209 1232.81897,925.36209 C1241.86165,925.36209 1252.41145,928.711231 1257.93753,936.581714 L1257.93753,927.204118 Z M1237.0054,986.316464 C1247.72265,986.316464 1257.2677,977.943611 1257.2677,966.054159 C1257.2677,953.997249 1247.22028,945.95931 1237.0054,945.95931 C1225.95323,945.95931 1216.74309,954.49962 1216.74309,966.054159 C1216.74309,977.441239 1225.95323,986.316464 1237.0054,986.316464 Z"
      />
    </S.Svg>
  )
}

export default SunAndLogo
