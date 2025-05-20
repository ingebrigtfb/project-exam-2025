import loadingIcon from '../../assets/loading.png';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <img 
        src={loadingIcon} 
        alt="Loading..." 
        className="w-12 h-12 animate-spin"
      />
    </div>
  );
} 