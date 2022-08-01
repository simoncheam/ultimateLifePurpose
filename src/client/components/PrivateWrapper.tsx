import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router';
import { APIService } from '../services/APIService';

const PrivateWrapper = ({ children }: PrivateRouteProps) => {

    const [isAuthed, setIsAuthed] = useState(false)
    const nav = useNavigate();
    const loc = useLocation();
    const [isLoaded, setIsLoaded] = useState<boolean>(false)





    useEffect(() => {

        APIService('/auth/validate')
            .then(res => {

                const tokenStatus = res.message === 'valid';
                setIsAuthed(tokenStatus)
                setIsLoaded(true)

            })
            .catch(e => {
                console.log(e)
                setIsLoaded(true)

            })

    }, [isLoaded])

    if (!isLoaded) { return <> Loading...</> }

    if (!isAuthed) {
        alert('not authorized, please login...')
        return <Navigate to='/login' />
    } else {



        return (
            <div>PrivateWrapper</div>
        )
    }
}

interface PrivateRouteProps {
    path?: string;
    exact?: boolean;
    children?: React.ReactNode;
}

export default PrivateWrapper