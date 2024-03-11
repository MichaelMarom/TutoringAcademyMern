import React, { useEffect } from 'react'
import Layout from './Layout'
import { useParams } from 'react-router-dom'

const EditAd = () => {
    const params = useParams()
    useEffect(() => {

    }, [params.id])

    return (
        <Layout>{params.id}</Layout>
    )
}

export default EditAd