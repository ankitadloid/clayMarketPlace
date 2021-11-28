import 'regenerator-runtime/runtime'
const Web3 = require("web3");
const ethEnabled = () => {
  if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
    window.ethereum.enable();
    if(window.ethereum.networkVersion != '80001'){
      alert("You are on wrong network , select polygon and refresh")
    }
    return true;
  }
  return false;
}
ethEnabled()


async function start(){

var nftContract = new web3.eth.Contract([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"addressMapArray","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"modelHash","type":"string"},{"internalType":"uint256","name":"bidAmount","type":"uint256"}],"name":"buySaleItem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"address_","type":"address"}],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"hash","type":"string"}],"name":"getMetaData","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"hash","type":"string"}],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"hash","type":"string"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"hash","type":"string"}],"name":"getRentPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"modelHash","type":"string"},{"internalType":"uint256","name":"bidAmount","type":"uint256"}],"name":"getRentableItem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"modelHash","type":"string"},{"internalType":"string","name":"metaDataHash","type":"string"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"address_","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"ownerPortfolio","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"modelHash","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"}],"name":"setPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"modelHash","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"timeForRent","type":"uint256"}],"name":"setPriceForRent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"recieverAddress","type":"address"}],"name":"transferCoin","outputs":[],"stateMutability":"nonpayable","type":"function"}],"0xb1a241EB5218d8AA211155F4757267ffE44B7F16");
 // console.log(nftContract)
  window.nftContract = nftContract
  nftContract.defaultAccount = web3.currentProvider.selectedAddress;
  const currentAddress = web3.currentProvider.selectedAddress;
  document.getElementById('balance_button').addEventListener('click',async ()=>{

     const result = await nftContract.methods.getBalance(currentAddress).call();
     document.getElementById('balance_div').innerHTML = result +" Loid Tokens"
       // console(result)

  })

  document.getElementById('transfer_button').addEventListener('click',async ()=>{
      const address = document.getElementById('toaddress').value;
      const amount = document.getElementById('toaddressamount').value
      console.log(address,amount)
     const result = await nftContract.methods.transferCoin(amount,address)
     .send({from:currentAddress});

       // console(result)

  })



  document.getElementById('mintButton').addEventListener('click',async ()=>{

    document.getElementById("mintButton").disabled = true

    document.getElementById("mintStatus").innerHTML = "";
    if(!(document.getElementById('name').value && document.getElementById('description').value && document.getElementById('file').files[0])){
      alert("empty name or description or file");
      return;
    }
  var formdata = new FormData();
  formdata.append("file",document.getElementById('file').files[0],"file");
  formdata.append("name",document.getElementById('name').value);
  formdata.append("description",document.getElementById('description').value);

  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };
  document.getElementById("mintStatus").innerHTML = "Uploading..";
  fetch("http://15.207.107.148:3001/mintNFT", requestOptions)
    .then(async (response)=>{
      const resp = await response.json();
      // console.log(resp);
      try{

     const result = await nftContract.methods.mint(resp.modelHash,resp.metaDataHash)
     .send({from:currentAddress});

     document.getElementById("mintStatus").innerHTML = "Sucessfully Minted: "+resp.modelHash;
         document.getElementById("mintButton").disabled = false

   }
   catch{
   document.getElementById("mintStatus").innerHTML = "Error: "+resp.modelHash+" Already Minted";
       document.getElementById("mintButton").disabled = false

   }



    })
    .then(result => console.log(result))
    .catch(error => {
      console.log('error', error)
      document.getElementById("mintStatus").innerHTML = "Error";
    document.getElementById("mintButton").disabled = false

    });




  })



  document.getElementById('checkPortFolio').addEventListener('click',async()=>{
    document.getElementById('checkPortFolio').disabled = true;
    document.getElementById("checkPortFolioResult").innerHTML=""
      let i=0;
      while(1){
        try{
          let result = await nftContract.methods.ownerPortfolio(web3.currentProvider.selectedAddress,i).call();

          // console.log(owner)
          let metaData = await fetch(`https://ipfs.io/ipfs/${result}`)
          metaData = await metaData.json();
          // console.log(metaData)
          let owner = await nftContract.methods.getOwner(metaData.file).call()
          // console.log(owner)
          if(owner.toLowerCase() == web3.currentProvider.selectedAddress.toLowerCase()){
            document.getElementById("checkPortFolioResult").innerHTML += `<a href="https://ipfs.io/ipfs/${metaData.file}">Name : ${metaData.name}
            <br>
            Description : ${metaData.description}
            <br>
            modelHash : ${metaData.file}

            </a>` +"<br> <br>"
          }
          i+=1;
        }
        catch{
              
          document.getElementById('checkPortFolio').disabled = false;

          break

        }
      }

  })


  document.getElementById('sellFileButton').addEventListener('click',async ()=>{

      document.getElementById('sellFileButton').disabled = true;
      document.getElementById("sellFileStatus").innerHTML = "STATUS : Pending "

      const fileHash = document.getElementById('sellFileHash').value;
      const amount = document.getElementById('sellPrice').value
      // console.log(address,amount)
      try{
        const result = await nftContract.methods.setPrice(fileHash,amount)
        .send({from:currentAddress});

        const result2 = await nftContract.methods.getMetaData(fileHash).call();

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "modelHash": result2,
          "amount": amount
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://15.207.107.148:3001/forSale", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error))
          .finally(()=>{ document.getElementById('sellFileButton').disabled = false;})



        document.getElementById("sellFileStatus").innerHTML = "STATUS : Sucessfull"
      }catch{
        document.getElementById("sellFileStatus").innerHTML = "STATUS : Error"
      document.getElementById('sellFileButton').disabled = false;

      }

       // console(result)

  })


  document.getElementById('getSaleItems').addEventListener('click',async ()=>{
    document.getElementById("getSaleItemsResult").innerHTML=""
    var myHeaders = new Headers();


var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("http://15.207.107.148:3001/forSale", requestOptions)
  .then(response => response.json())
  .then(async result => {
          // console.log(result)
          for(let key in result){


          let metaData = await fetch(`https://ipfs.io/ipfs/${key}`)
          metaData = await metaData.json();

            document.getElementById("getSaleItemsResult").innerHTML += `<a href="https://ipfs.io/ipfs/${metaData.file}">Name : ${metaData.name}
            <br>
             Description : ${metaData.description}
             <br> 
             modelHash : ${metaData.file}
             <br>
             Price : ${await nftContract.methods.getPrice(metaData.file).call()}

             </a>` +"<br><br>"

           

          }




  })
  .catch(error => console.log('error', error));
  
  })


  document.getElementById('buyFileButton').addEventListener('click',async ()=>{

      document.getElementById("buyFileStatus").innerHTML = "STATUS : Pending"

      document.getElementById('buyFileButton').disabled = true;
      const fileHash = document.getElementById('buyFileHash').value;
      const amount = document.getElementById('buyPrice').value
      // console.log(address,amount)
      try{
        const result = await nftContract.methods.buySaleItem(fileHash,amount)
        .send({from:currentAddress});

        const result2 = await nftContract.methods.getMetaData(fileHash).call();

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "modelHash": result2,
          "amount": 0
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://15.207.107.148:3001/forSale", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error))
          .finally(()=>{ document.getElementById('buyFileButton').disabled = false;})



        document.getElementById("buyFileStatus").innerHTML = "STATUS : Sucessfull"
      }catch{
        document.getElementById("buyFileStatus").innerHTML = "STATUS : Error"
         document.getElementById('buyFileButton').disabled = false;

      }

       // console(result)

  })



}

start()
