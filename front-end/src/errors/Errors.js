export default function Errors({ errors }) {
    return (
        <div className="alert alert-danger" role="alert">
            {errors.map((error, index) => {
                return <p key={index}>{error.message}</p>;
            })}
        </div>
    )
}