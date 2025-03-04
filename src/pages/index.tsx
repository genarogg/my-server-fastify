'use client'
import React from 'react'

import Healthcheck from '../client/views/healthcheck/Healthcheck'

interface homeProps {

}

const home: React.FC<homeProps> = () => {
  return (<span className='healthcheck'><Healthcheck /></span>);
}

export default home;