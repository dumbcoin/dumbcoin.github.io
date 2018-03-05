console.log('hello dum person!');
$(function () { 
    console.log('entering function');
    if (typeof web3 !== 'undefined') {
        console.log('test1');
        web3 = new Web3(web3.currentProvider);

        if (web3.currentProvider.isMetaMask === true) {
            $('#buyForm').show();
            $('#nometamask').hide();

            var saleAddress = '0xc599523f90dc823b9c9dbb3859e22774b46bf6ba';
            var saleABI = 
    [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalContribution","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"disablePurchasing","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"enablePurchasing","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalTokensIssued","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalBonusTokensIssued","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getStats","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"purchasingAllowed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenContract","type":"address"}],"name":"withdrawForeignTokens","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];
       
            var saleContract = web3.eth.contract(saleABI).at(saleAddress); 
            

            $('#buyForm').submit(function (e) {
                // Prevent the browser from POSTing the form.
                e.preventDefault();

                var numberOfTokens = web3.toBigNumber($('#number').val());
                var send = web3.eth.sendTransaction({from:web3.eth.coinbase,to:saleAddress, value:web3.toWei(numberOfTokens.div(100), "ether")}, function(error, result){
                if(!error)
                    console.log(result)
                else
                   console.error(error);
                });
     
            });
        } 
    }     
});




function decodeStats(response, price) {
    if (response == null) return null;

    var result = response.result;
    if (result == null || result.length == null || result.length < 193) return null;

    var weiPerEther = new BigNumber("1000000000000000000", 10);

    var totalContributionExact = new BigNumber(result.substr(2, 64), 16).div(weiPerEther);
    var totalContributionUSDExact = totalContributionExact.times(new BigNumber(price));

    return {
        totalContribution: totalContributionExact.round(3, BigNumber.ROUND_DOWN),
        totalContributionUSD: totalContributionUSDExact.round(0, BigNumber.ROUND_DOWN),
        totalContributionTVs: totalContributionUSDExact.div(new BigNumber("1200")).round(0, BigNumber.ROUND_DOWN),
        totalSupply: new BigNumber(result.substr(66, 64), 16).div(weiPerEther).round(3, BigNumber.ROUND_DOWN),
        totalBonusTokensIssued: new BigNumber(result.substr(130, 64), 16).div(weiPerEther).round(3, BigNumber.ROUND_DOWN),
        purchasingAllowed: new BigNumber(result.substr(194, 64), 16).isZero() == false
    };
}

function getStats(price) {
    var url = "https://api.etherscan.io/api?module=proxy&action=eth_call&to=0xC599523f90Dc823b9c9dBb3859e22774B46BF6ba&data=0xc59d48470000000000000000000000000000000000000000000000000000000000000000&tag=latest";
    return $.ajax(url, {
        cache: false,
        dataType: "json"
    }).then(function (data) { return decodeStats(data, price); });
}

function getPrice() {
    var url = "https://api.etherscan.io/api?module=stats&action=ethprice";
    return $.ajax(url, {
        cache: false,
        dataType: "json"
    }).then(function (data) {
        if (data == null) return null;
        if (data.result == null) return null;
        if (data.result.ethusd == null) return null;

        return parseFloat(data.result.ethusd);
    });
}

function updatePage(stats) {
    if (stats == null) return;


    $("#total-ether").text(stats.totalContribution.toFixed(3));
    if (stats.totalContribution.toNumber() <= 0) {
        $("#total-ether-message").text("Looks like everyone read the warnings so far.");
    } else {
        $("#total-ether-message").text("I had a feeling someone would waste their money.");
    }

    $("#total-usd").text("$" + stats.totalContributionUSD.toFixed(0));
    if (stats.totalContributionUSD.toNumber() <= 0) {
        $("#total-usd-message").text("No Ether yet, so no cash either.");
    } else if (stats.totalContributionTVs.toNumber() < 1) {
        $("#total-usd-message").text("Not enough to buy a television yet.");
    }else if (stats.totalContributionTVs.toNumber() < 2) {
        $("#total-usd-message").text("Enough to buy a television.");
    } else {
        $("#total-usd-message").text("Enough to buy " + stats.totalContributionTVs.toFixed(0) + " televisions!");
    }

    $("#total-tokens").text(stats.totalSupply.toFixed(3));
    if (stats.totalSupply <= 0) {
        $("#total-tokens-message").text("No useless tokens issued yet either.");
    } else if (stats.totalBonusTokensIssued.toNumber() <= 0) {
        $("#total-tokens-message").text("Look at all those useless tokens!");
    } else {
        $("#total-tokens-message").text("Including " + stats.totalBonusTokensIssued.toFixed(3) + " bonus tokens!");
    }

    $("#stats").show();
}

function refresh() { getPrice().then(getStats).then(updatePage); }

$(function() {
    try {
        refresh();
        setInterval(refresh, 1000 * 60 * 5);
    } catch (err) { }
});
