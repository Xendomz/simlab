import ItkLogo from '../assets/itk_logo.png'

const LoadingPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen flipping-loader">
            <img src={ItkLogo} className='flipping-img' />
        </div>
    )
}

export default LoadingPage
