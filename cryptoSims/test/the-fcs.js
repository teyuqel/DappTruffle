const TheFunixCryptoSim = artifacts.require("TheFunixCryptoSim");

contract("TheFunixCryptoSim", function (accounts) {
  let instance;

  before(async function () {
    instance = await TheFunixCryptoSim.deployed();
  });

  describe("Contract", function () {
    it("should deployed", function () {
      return assert.isTrue(instance !== undefined);
    });
  });

  // *** Start Code here ***
  describe("Thông tin token",function(){
    it("Token Symbol",function(){
      // Check symbol của token 
      return instance.symbol({from:accounts[0]})
      .then(function(result){
        assert.equal(result,"FCS","")
      })
    })

    it("Token Name",function(){
      // Check name của token
      return instance.name({from:accounts[1]})
      .then(function(result){
        assert.equal(result,"TheFunixCryptoSims","")
      })
    })
  })

  describe("Thông tin Genesis FCS",function(){
    it("Genesis 1",function(){
      // Kiểm tra thuộc tính của genesis 1 có bằng với thuộc tính mặc định trong contract
      return instance.getSimDetails(0,{from:accounts[1]})
      .then(function(result){
        assert.equal(result[1],"0,0,0,0,0,0,0","")
      })
    })

    it("Genesis 2",function(){
      // Kiểm tra thuộc tính của genesis 1 có bằng với thuộc tính mặc định trong contract
      return instance.getSimDetails(1,{from:accounts[2]})
      .then(function(reset){
        assert.equal(reset[1],"3,7,127,31,31,0,0","")
      })
    })
  })

  describe("Thuật toán lai tạo",function(){
    describe("Gen ẩn X",function(){
      it("Với xM = xS",function(){
        // Sim 0 có gen ẩn X = 0
        // Sim 1 có gen ẩn X = 0
        return instance.breedSim(0,1,{from:accounts[0]})
        .then(function(){
          return instance.getSimDetails(4,{from:accounts[0]})
        }).then(function(result){
          assert.equal(result[1].hiddenGenes,"3","")
        })
      })

      it("Voi xM > xS",function(){
        // Sim 2 có gen ẩn X = 1 
        // Sim 1 có gen ẩn X = 0
        return instance.breedSim(2,1,{from:accounts[0]})
      .then(function(){
        return instance.getSimDetails(5,{from:accounts[0]})
      }).then(function(result){
        assert.equal(result[1].hiddenGenes,"1","")
      })
      })
      it("Voi xM < xS",function(){
        // Sim 1 có gen ẩn X = 1
        // Sim 3 có gen ẩn X = 2
        return instance.breedSim(1,3,{from:accounts[0]})
      .then(function(){
        return instance.getSimDetails(6,{from:accounts[0]})
      }).then(function(result){
        assert.equal(result[1].hiddenGenes,"2","")
      })
    
   
      })
    })

    describe("Thuộc tính của Sim mới được lai tạo",function(){
      it("Generation(gM > gS)",function(){
        // Sim 4 có thế hệ là 1
        // Sim 1 có thể hệ là 0
        // Tạo ra sim 7 có thế hệ bằng 2 ( gM > gS )
        return instance.breedSim(4,1,{from:accounts[0]})
        .then(function(){
          return instance.getSimDetails(7,{from:accounts[1]})
        }).then(function(result){
          assert.equal(result[1].generation,"2","")
        })
      })

      it("Generation(gM < gS",function(){
        // Sim 4 có thế hệ là 1
        // Sim 7 có thế hệ là 2
        // Tạo ra sim 8 có thế hệ bằng 3 ( gS > gM )
        return instance.breedSim(4,7,{from:accounts[0]})
        .then(function(){
          return instance.getSimDetails(8,{from:accounts[1]})
        }).then(function(result){
          assert.equal(result[1].generation,"3","")
        })
      })

      it("Body", function(){
          // Với TH x = 0,
          // Sim 8 có gen ẩn X = 0 (lai tạo từ 2 sim 4 và 7 có gen ẩn là 3) 
        return instance.getSimDetails(8,{from:accounts[1]})
        .then(function(result){
          // Kiểm tra thuộc tính body của sim 8
          assert.equal(result[1].body,"3","")
        })
        .then(function(){
          // Với TH x = 1,
          // Sim 5 có gen ẩn X = 1 (lai tạo từ 2 sim 2 và 1 có gen ẩn lần lượt là 1, 0)
          return instance.getSimDetails(5,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính body của sim 5 
          assert.equal(result[1].body,"0","")
        })
        .then(function(){
          // Với TH x = 2,
          // Sim 6 có gen ẩn X = 2 (lai tạo từ 2 sim 1 và 3 có gen ẩn lần lượt là 0, 2)
          return instance.getSimDetails(6,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính body của sim 6
          assert.equal(result[1].body,"0","")
        })
        .then(function(){
          // Với TH x = 3,
          // Sim 7 có gen ẩn X = 3 (lai tạo từ 2 sim 4 và 1 có gen ẩn lần lượt là 3, 0)
          return instance.getSimDetails(7,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính body của sim 7
          assert.equal(result[1].body,"0","")
        })
      })

      
      it("Eye", function(){
        // Với TH x = 0,
        // Sim 8 có gen ẩn X = 0 (lai tạo từ 2 sim 4 và 7 có gen ẩn là 3) 
        return instance.getSimDetails(8,{from:accounts[1]})
        .then(function(result){
          // Kiểm tra thuộc tính eye của sim 8
          assert.equal(result[1].eye,"6","")
        })
        .then(function(){
          // Với TH x = 1,
          // Sim 5 có gen ẩn X = 1 (lai tạo từ 2 sim 2 và 1 có gen ẩn lần lượt là 1, 0)
          return instance.getSimDetails(5,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính eye của sim 5 
          assert.equal(result[1].eye,"7","")
        })
        .then(function(){
          // Với TH x = 2,
          // Sim 6 có gen ẩn X = 2 (lai tạo từ 2 sim 1 và 3 có gen ẩn lần lượt là 0, 2)
          return instance.getSimDetails(6,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính eye của sim 6
          assert.equal(result[1].eye,"6","")
        })
        .then(function(){
          // Với TH x = 3,
          // Sim 7 có gen ẩn X = 3 (lai tạo từ 2 sim 4 và 1 có gen ẩn lần lượt là 3, 0)
          return instance.getSimDetails(7,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính eye của sim 7
          assert.equal(result[1].eye,"6","")
        })
      })

      it("Hairstyle", function(){
        // Với TH x = 0,
        // Sim 8 có gen ẩn X = 0 (lai tạo từ 2 sim 4 và 7 có gen ẩn là 3) 
        return instance.getSimDetails(8,{from:accounts[1]})
        .then(function(result){
          // Kiểm tra thuộc tính Hairstyle của sim 8
          assert.equal(result[1].hairstyle,"127","")
        })
        .then(function(){
          // Với TH x = 1,
          // Sim 5 có gen ẩn X = 1 (lai tạo từ 2 sim 2 và 1 có gen ẩn lần lượt là 1, 0)
          return instance.getSimDetails(5,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính Hairstyle của sim 5 
          assert.equal(result[1].hairstyle,"0","")
        })
        .then(function(){
          // Với TH x = 2,
          // Sim 6 có gen ẩn X = 2 (lai tạo từ 2 sim 1 và 3 có gen ẩn lần lượt là 0, 2)
          return instance.getSimDetails(6,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính Hairstyle của sim 6
          assert.equal(result[1].hairstyle,"0","")
        })
        .then(function(){
          // Với TH x = 3,
          // Sim 7 có gen ẩn X = 3 (lai tạo từ 2 sim 4 và 1 có gen ẩn lần lượt là 3, 0)
          return instance.getSimDetails(7,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính Hairstyle của sim 7
          assert.equal(result[1].hairstyle,"127","")
        })
      })

      it("Outfit", function(){
        // Với TH x = 0,
        // Sim 8 có gen ẩn X = 0 (lai tạo từ 2 sim 4 và 7 có gen ẩn là 3) 
        return instance.getSimDetails(8,{from:accounts[1]})
        .then(function(result){
          // Kiểm tra thuộc tính outfit của sim 8
          assert.equal(result[1].outfit,"30","")
        })
        .then(function(){
          // Với TH x = 1,
          // Sim 5 có gen ẩn X = 1 (lai tạo từ 2 sim 2 và 1 có gen ẩn lần lượt là 1, 0)
          return instance.getSimDetails(5,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính outfit của sim 5 
          assert.equal(result[1].outfit,"31","")
        })
        .then(function(){
          // Với TH x = 2,
          // Sim 6 có gen ẩn X = 2 (lai tạo từ 2 sim 1 và 3 có gen ẩn lần lượt là 0, 2)
          return instance.getSimDetails(6,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính outfit của sim 6
          assert.equal(result[1].outfit,"29","")
        })
        .then(function(){
          // Với TH x = 3,
          // Sim 7 có gen ẩn X = 3 (lai tạo từ 2 sim 4 và 1 có gen ẩn lần lượt là 3, 0)
          return instance.getSimDetails(7,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính outfit của sim 7
          assert.equal(result[1].outfit,"30","")
        })
      })

      it("Accessory", function(){
        // Với TH x = 0,
        // Sim 8 có gen ẩn X = 0 (lai tạo từ 2 sim 4 và 7 có gen ẩn là 3) 
        return instance.getSimDetails(8,{from:accounts[1]})
        .then(function(result){
          // Kiểm tra thuộc tính Accessory của sim 8
          assert.equal(result[1].accessory,"26","")
        })
        .then(function(){
          // Với TH x = 1,
          // Sim 5 có gen ẩn X = 1 (lai tạo từ 2 sim 2 và 1 có gen ẩn lần lượt là 1, 0)
          return instance.getSimDetails(5,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính Accessory của sim 5 
          assert.equal(result[1].accessory,"29","")
        })
        .then(function(){
          // Với TH x = 2,
          // Sim 6 có gen ẩn X = 2 (lai tạo từ 2 sim 1 và 3 có gen ẩn lần lượt là 0, 2)
          return instance.getSimDetails(6,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính Accessory của sim 6
          assert.equal(result[1].accessory,"27","")
        })
        .then(function(){
          // Với TH x = 3,
          // Sim 7 có gen ẩn X = 3 (lai tạo từ 2 sim 4 và 1 có gen ẩn lần lượt là 3, 0)
          return instance.getSimDetails(7,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính Accessory của sim 7
          assert.equal(result[1].accessory,"28","")
        })
      })

      it("HiddenGene", function(){
        // Với TH x = 0,
        // Sim 8 có gen ẩn X = 0 (lai tạo từ 2 sim 4 và 7 có gen ẩn là 3) 
        return instance.getSimDetails(8,{from:accounts[1]})
        .then(function(result){
          // Kiểm tra thuộc tính HiddenGene của sim 8
          assert.equal(result[1].hiddenGenes,"0","")
        })
        .then(function(){
          // Với TH x = 1,
          // Sim 5 có gen ẩn X = 1 (lai tạo từ 2 sim 2 và 1 có gen ẩn lần lượt là 1, 0)
          return instance.getSimDetails(5,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính HiddenGene của sim 5 
          assert.equal(result[1].hiddenGenes,"1","")
        })
        .then(function(){
          // Với TH x = 2,
          // Sim 6 có gen ẩn X = 2 (lai tạo từ 2 sim 1 và 3 có gen ẩn lần lượt là 0, 2)
          return instance.getSimDetails(6,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính HiddenGene của sim 6
          assert.equal(result[1].hiddenGenes,"2","")
        })
        .then(function(){
          // Với TH x = 3,
          // Sim 7 có gen ẩn X = 3 (lai tạo từ 2 sim 4 và 1 có gen ẩn lần lượt là 3, 0)
          return instance.getSimDetails(7,{from:accounts[1]})
        }).then(function(result){
          // Kiểm tra thuộc tính HiddenGene của sim 7
          assert.equal(result[1].hiddenGenes,"3","")
        })
      })

    })
  })
  // *** End Code here ***
})