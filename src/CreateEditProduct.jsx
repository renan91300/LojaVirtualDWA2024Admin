import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from './ProductForm';
import { useEffect, useState } from 'react';
import api from "./axiosApi";
import FormButtons from './FormButtons';
import handleChange from './handleChange';
import parseErrors from './parseErrors';
import Loading from './Loading';

const CreateEditProduct = () => {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const idProduto = useParams().id;

    function loadProductById(id) {
        setLoading(true);
        const getProductEndpoint = `admin/obter_produto/${id}`;
        api.get(getProductEndpoint)
            .then(response => {
                setInputs(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar produto:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    async function editProduct(formData) {
        const editProductEndpoint = "admin/alterar_produto";
        await api.postForm(editProductEndpoint, formData)
            .then((response) => {
                if (response.status === 204) {
                    navigate("/products");
                } else {
                    console.log(response);
                }
            })
            .catch((error) => {
                if (error && error.response && error.response.data)
                    setErrors(parseErrors(error.response.data));
            })
            .finally(() => {
                setLoading(false);
            });
    }

    async function createProduct(formData) {
        const createProductEndpoint = "admin/inserir_produto";
        await api.postForm(createProductEndpoint, formData)
            .then((response) => {
                if (response.status === 201) {
                    navigate("/products");
                } else {
                    console.log(response);
                }
            })
            .catch((error) => {
                if (error && error.response && error.response.data)
                    setErrors(parseErrors(error.response.data));
            })
            .finally(() => {
                setLoading(false);
            });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData();
        Object.entries(inputs).forEach(([key, value]) => {
            formData.append(key, value);
        });
        if (file) {
            formData.append('imagem', file);
        }

        if (idProduto) {
            await editProduct(formData);
        } else {
            await createProduct(formData);
        }        

    }

    function localHandleChange(event) {
        handleChange(event, inputs, setInputs);
    }

    function handleFileChange(event) {
        setFile(event.target.files[0]);
    }

    useEffect(() => {
        if (idProduto) {
            setInputs({ ...inputs, id: idProduto });
            loadProductById(idProduto);
        }
    }, [idProduto]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>{idProduto ? "Editar" : "Cadastrar"} Produto</h1>
            </div>
            <form onSubmit={handleSubmit} noValidate autoComplete='off'>
                <ProductForm handleChange={localHandleChange} handleFileChange={handleFileChange} inputs={inputs} errors={errors} isNew={false} />
                <FormButtons cancelTarget="/products" />
            </form>
            {loading && <Loading />}
        </>
    );
}

export default CreateEditProduct;