const hre = require("hardhat");

async function main() {
  const Registro = await hre.ethers.getContractFactory("RegistroPropiedades");
  const registro = await Registro.deploy();
  await registro.waitForDeployment();
  console.log("Contrato desplegado en:", await registro.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});