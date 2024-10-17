const ButtonModal = ({ onClick }) => {
    return (
        <button onClick={onClick} className="bg-purple-600 text-white px-4 py-2 rounded-full">
            Ajouter un modèle
        </button>
    );
};

export default ButtonModal;
