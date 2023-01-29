import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Loding = () => {
    return (
        <div className="bg-slate-100 text-white m-6 rounded-md w-[500px] h-32">
            <Skeleton baseColor="gray" width={80} className='' />
            <Skeleton baseColor="gray" count={3} width={400} className='' />
            <div className='flex justify-center gap-3'>
            <Skeleton baseColor="gray" width={50} className='' />
            </div>
        </div>
    );
}

export default Loding;