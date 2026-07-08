interface LoadingProps {
    size?: number;
}

function Loading({ size = 5 }: LoadingProps) {
    return (
        <div
            className={`h-${size} w-${size} bg-transparent border-2 border-border border-t-black border-r-black rounded-full animate-spin`}
        ></div>
    );
}
export default Loading;
