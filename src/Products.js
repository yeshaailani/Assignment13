import React, { Component } from 'react'
import Filters from './Filters'
import ProductTable from './ProductTable'
import ProductForm from './ProductForm'

let PRODUCTS = {};

class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filterText: '',
            products: PRODUCTS
        }
        this.handleFilter = this.handleFilter.bind(this)
        this.handleDestroy = this.handleDestroy.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.populateForm = this.populateForm.bind(this)
        this.child = React.createRef();
    }
    componentDidMount(){
        fetch(`/product/get`)
        .then(data => data.json())
        .then(data => this.setState({products:data}))
    }

    handleFilter(filterInput) {
        this.setState(filterInput)
    }

    handleSave(product) {

        product.productid = new Date().getTime()
        product.instock = true;
        this.setState((prevState) => {
            let products = prevState.products
            products[product.productid] = product
            return { products }
        })

        var data = {'product' : product, 'id': product.productid}
        fetch('/product/create',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                        'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => {
            console.log(response)
        })
        .catch(error =>{
            console.log(error)
        })
    }

    handleDestroy(productId) {

        this.setState((prevState) => {
            let products = prevState.products
            delete products[productId]
            return { products }
        });


        fetch(`/product/delete/${productId}`,{
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                        'Content-Type': 'application/json',
            }
        }).then(response => {
            console.log(response)
        })
        .catch(error =>{
            console.log(error)
        })
    }

    populateForm(productId) {
        console.log("Update this "+productId)
        let productToUpdate = this.state.products[productId]
        this.child.current.fillForm(productToUpdate);
    }

    handleUpdate(updatedProduct) {
        console.log("Updated")
        console.log(updatedProduct)
        this.setState((prevState) => {
            let products = prevState.products
            products[updatedProduct.productid] = updatedProduct
            return { products }
        });

        var productId = updatedProduct.productid;
        var data = {'product' : updatedProduct, 'id': productId}
        fetch(`/product/update/${productId}`,{
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                        'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => {
            console.log(response)
        })
        .catch(error =>{
            console.log(error)
        })
    }

    render () {
        return (
            <div>
                <h1>My Inventory</h1>
                <Filters 
                    onFilter={this.handleFilter}></Filters>
                <ProductTable 
                    products={this.state.products}
                    filterText={this.state.filterText}
                    onDestroy={this.handleDestroy}
                    onModify={this.populateForm}
                    onUpdate={this.handleUpdate}>

                </ProductTable>
                <ProductForm
                    onUpdate={this.handleUpdate}
                    onSave={this.handleSave}
                    ref={this.child}></ProductForm>
            </div>
        )
    }
}

export default Products