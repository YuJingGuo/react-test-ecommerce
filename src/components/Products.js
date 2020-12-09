import React, { useState, useEffect } from 'react'
import { Col, Card, Spinner } from 'react-bootstrap'
import env from './env'

function Products(props) {
    let { products, productscount, loading, pageSize, isFetching } = props;
    let moreItems = products.length >= (productscount + (productscount/pageSize));
    let showProducts = []

    const formatDate = (date) => {
        let currentDate = new Date();
        let dateDiff = Math.round(( Date.parse(currentDate) - Date.parse(date) ) / (60 * 60 * 24 * 1000));        

        if(dateDiff === 0){
            return "Today";
        }

        if(dateDiff < 6){
            let dayOrDays = dateDiff === 1 ? "day" : "days";
            return `${dateDiff} ${dayOrDays} ago`;
        } else {
            return new Date(date).toLocaleDateString("en-US");
        }    
    }

    const formatPrice = (price) => {
        let dollars = price/100;
        return `$${dollars}`;
    }

    showProducts.push(products.map((product, index) => {
        if(product.hasOwnProperty('pid')) {
            return (                
                <Col md={12} key={index} style={{padding: 15}}>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={`${env.apiUrl}/ads/?r=${product.pid}`} />
                        <Card.Body>
                            <Card.Title>Advertisement</Card.Title>
                            <Card.Text>
                                We are a tech company.We got all sort of products & gadgets
                            </Card.Text>                        
                        </Card.Body>
                    </Card>
                </Col>
            )
        }
        return (        
            <Col md={3} key={index} style={{padding: 15}}>
                <Card style={{height: 200}}>                    
                    <Card.Body>      
                        <Card.Title>
                            <span style={{fontSize: product.size}}>{product.face}</span>    
                        </Card.Title>          
                        <Card.Text>
                            { formatPrice(product.price) }
                        </Card.Text>                
                        <Card.Text>
                            { formatDate(product.date) }
                        </Card.Text>                
                    </Card.Body>
                </Card>
            </Col>    
        )  
    }))    

    if(isFetching && loading) {
        showProducts.push(<Col><Spinner animation="border" variant="warning" />&nbsp;Loading...</Col>)
    }    

    if(!loading && moreItems && products.length !== 0){
        // showProducts.pop()
        showProducts.push(<Col>~ end of catalogue ~</Col>)
    }    

    return showProducts;
}

export default Products;