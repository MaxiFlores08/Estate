// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract RegistroPropiedades {
    mapping(string => string) private hashes;

    function registrarPropiedad(string memory id, string memory hashDocumento) public {
        require(bytes(hashes[id]).length == 0, "La propiedad ya esta registrada");
        hashes[id] = hashDocumento;
    }

    function obtenerHash(string memory id) public view returns (string memory) {
        return hashes[id];
    }
}