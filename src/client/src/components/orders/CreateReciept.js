import React from "react"
import {Query} from "react-apollo";
import {gql} from 'apollo-boost';

function CreateReceipt(dishes, id) {
  const totalCosts = dishes.reduce((a, c) => a + (c.extras || []).reduce((f, e) => f + e.cost, 0) + c.dish.cost, 0).toFixed(2)

  return (
    <Query
      query={gql`{ company {
                    name,
                    street, 
                    postalCode,
                    city, 
                    website,
                    taxId,
                    vat
                  }
                }`}>
      {({loading, error, data}) => {
        if (!loading && !error && data){
          const {name, street, postalCode, city, website, taxId, vat} = data.company
          const taxRate = vat > 0 && vat < 100 ? vat : 19;
          const dateTime = new Date().toLocaleString("de").split(',')
          return (<div className="receipt">
            <div className="header">
              <h2>{name}</h2>
              <p>{street}</p>
              <p>{postalCode} {city}</p>
              <p>{website}</p>
              <p>{taxId}</p>
            </div>
            <table className="receipt" align="center">
              <tbody>
                <tr>
                  <td>
                    Datum: {dateTime[0]}
                  </td>
                  <td>
                    Zeit: {dateTime[1]}
                  </td>
                </tr>
                <tr >
                  <td className="bill-split"></td>
                  <td className="bill-split"></td>
                </tr>
                <tr>
                  <th></th>
                  <th>EUR</th>
                </tr>
                {dishes.map((d, idx) =>
                  <tr key={idx}>
                    <td>{d.dish.name}</td>
                    <td>{(d.dish.cost + (d.extras || []).reduce((a, e) => a + e.cost, 0)).toFixed(2)}</td>
                  </tr>
                )}
                <tr>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                </tr>
                <tr >
                  <td className="bill-split"></td>
                  <td className="bill-split"></td>
                </tr>
                <tr>
                  <td className="bill-payment">ANZAHL DER ARTIKEL {dishes.length}</td>
                </tr>
                <tr>
                  <td>davon MwSt. ({taxRate}%)</td>
                  <td>{(totalCosts - (totalCosts / (1 + (taxRate/100)))).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="bill-payment"><h5>TOTAL</h5></td>
                  <td className="bill-payment">{totalCosts}</td>
                </tr>
                
              </tbody>
            </table >
            <table className="receipt" align="center">
              <tbody>
                <tr>
                  <td>
                    Bon: {id}
                  </td>
                </tr>
              </tbody>
            </table>
          </div >)}
        return (<React.Fragment/>)

      }}
    </Query>
  )
}

export default CreateReceipt;