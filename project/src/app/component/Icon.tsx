import Image from 'next/image'

// retuen image with width100%
const Icon = ({ path }: any) => {
    return (
        <Image
            src={path}
            width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }}
            alt='icon'// optional />
        />
    )
}

export default Icon