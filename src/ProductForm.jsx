const ProductForm = ({ handleChange, inputs, errors, isNew }) => {
  return (
    <>
        <div className="row">
            <div className="form-floating">
                <input type="text" className="form-control" placeholder=" " id="nome" name="nome" value={inputs?.value} />
                <label htmlFor="nome">Nome</label>
                {errors?.nome && <div className="invalid-feedback">{errors.nome}</div>}
            </div>
        </div>
    </>
  )
}

export default ProductForm