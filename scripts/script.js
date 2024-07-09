const hre = import("thirdweb");

async function main(){
    const UITCertificate = await hre.ethers.getContractFactory("UITCertificate");
    const UITcertificate = await UITCertificate.deploy();

    await UITcertificate.deployed();

    console.log("UITCert deployed to: ", UITcertificate.address);
}

main()
    .then(() => process.exit(0))
    .catch ((error) => {
        console.error(error);
        process.exit(1);
    });