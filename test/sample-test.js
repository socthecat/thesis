const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Diploma", function () {
  let diploma;
  const college = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8';
  const student = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
  const someUri = 'img/test.png';

  beforeEach(async () => {
    const Diploma = await ethers.getContractFactory("Diploma");
    diploma = await Diploma.deploy();
    await diploma.deployed();
  });

  it("Should mint and transfer token succesfully", async function () {
    let collegeBalance = await diploma.balanceOf(college);
    let studentBalance = await diploma.balanceOf(student);

    expect(collegeBalance).to.equal(0);
    expect(studentBalance).to.equal(0);

    const mintedToken = await diploma.safeMint(college, someUri, 0);
    await mintedToken.wait();

    collegeBalance = await diploma.balanceOf(college);
    expect(collegeBalance).to.equal(1);

    const transferToStudent = await diploma.sendToStudent(0, college, student);
    await transferToStudent.wait();

    collegeBalance = await diploma.balanceOf(college);
    expect(collegeBalance).to.equal(0);
    studentBalance = await diploma.balanceOf(student);
    expect(studentBalance).to.equal(1);
  });

  it("Should mark URI as owned after minted", async function () {
    const mintedToken = await diploma.safeMint(college, someUri, 0);
    await mintedToken.wait();

    const isContentOwned = await diploma.isContentOwned(someUri);

    expect(isContentOwned).to.equal(true);
  });
});
