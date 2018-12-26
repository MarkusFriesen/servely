function CreateReceipt(dishes) {
  let result = ""
  const totalCosts = dishes.reduce((a, c) => a + c.cost, 0).toFixed(2)
  dishes.forEach(d => {
    result += `  
        <tr>
          <td>${d.name}</td>
          <td>${d.cost.toFixed(2)}</td>
        </tr>`
  })
  return `
<!DOCTYPE html>
<html lang="en">
  <body>
    <h1>Receipt</h1>
    <h3>${new Date().toLocaleString()}</h3>
    <p>
      <table>
        <tr>
          <th></th>
          <th>Amount</th>
        </tr>
        ${ result }
        <tr>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Total</td>
          <td>${totalCosts}</td>
        </tr>
        <tr>
          <td>Tax</td>
          <td>${(totalCosts - (totalCosts/1.19)).toFixed(2)}</td>
        </tr>
      </table>
    </p>
  </body>
</html>`
}

export default CreateReceipt;