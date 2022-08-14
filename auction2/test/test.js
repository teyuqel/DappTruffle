let Auction = artifacts.require('./Auction.sol');

 

let auctionInstance;

 

contract('AuctionContract', function(accounts) {

  //accounts[0] is the default account

  describe('Contract deployment', function() {

    it('Contract deployment', function() {

      //Fetching the contract instance of our smart contract

      return Auction.deployed().then(function(instance) {

        //We save the instance in a global variable and all smart contract functions are called using this

        auctionInstance = instance;

        assert(

          auctionInstance !== undefined,

          'Auction contract should be defined'

        );

      });

    });

    it('Initial rule with corrected startingPrice and minimumStep', function() {

      //Fetching the rule of Auction

      return auctionInstance.rule().then(function(rule) {

        //We save the instance in a global variable and all smart contract functions are called using this

        assert(rule !== undefined, 'Rule should be defined');

 

        assert.equal(rule.startingPrice, 50, 'Starting price should be 50');

        assert.equal(rule.minimumStep, 5, 'Minimum step should be 5');

      });

    });

  });
  describe('Register', function(){
    it('Only Auctioneer can register bidders', function(){
      //testing for a positive condition
      // Đăng ký tài khoản 1 từ tài khoản 0 
      return auctionInstance.register(accounts[1],200,{from:accounts[0]})
      .then(function(){
        // Kiểm tra xem đã đăng ký thành công chưa
        return auctionInstance.bidders(accounts[1],{from:accounts[0]})
        .then(function(result){
          assert.equal(result[0],200,"")
        })
      }).then(function(){
        //testing for a negative condition
        // Đăng ký tài khoản 2 từ tài khoản 1 
        return auctionInstance.register(accounts[2],100,{from:accounts[1]})
      .then(function(instance){
        // Kiểm tra xem có tạo ra lỗi ko
        throw("Failed to register");
      }).catch(function(e){
        if(e === "Failed to register"){
          assert(false);
        }
        else{
          assert(true);
        }
      })
      })
    });

    it('When register, the account address and the number of tokens need to be inputted', function(){
      // Đăng ký account 2 từ account 0
      return auctionInstance.register(accounts[2],200,{from:accounts[0]})
      .then(function(){
      // Kiểm tra xem đã đăng ký thành công chưa
       return auctionInstance.bidders(accounts[2],{from:accounts[1]})
      }).then(function(result){
         assert.equal(result[0],200)
         assert.equal(result[1],0)
      })
      .then(function(){
        // Đăng ký nhưng ko thêm địa chỉ account và số lượng token 
       return auctionInstance.register({from:accounts[0]})
      }).then(function(){
        // Kiểm tra xem có tạo ra lỗi hay ko
       throw("Failed to register")
      }).catch(function(e){
       if(e === "Failed to register"){
         assert(false)
       }else{
         assert(true)
       }
      })
     });

    it('This action is only available in Created State', function(){
      // Kiểm tra trạng thái hiện tại của phiên đấu giá có là Created ko
      return auctionInstance.state({from:accounts[0]})
      .then(function(result){
        assert.equal(result,0,"")
      }).then(function(){
        // Đăng ký tài khoản 3 và kiếm tra bidders để biết đã đăng ký thành công hay chưa
        return auctionInstance.register(accounts[3],100,{from:accounts[0]})
      })
      .then(function(){
        return auctionInstance.bidders(accounts[3],{from:accounts[0]})
      }).then(function(result1){
        assert.equal(result1[0],100)
      })
      
    });
  });

  describe('Start the session', function(){
    it('Only Auctioneer can start the session', function(){
      // Bắt đầu phiên đấu  giá từ tài khoản 1 
      return auctionInstance.startSession({from:accounts[1]})
      .then(function(){
        // Kiểm tra xem có tạo ra lỗi hay ko
        throw("Failed to start session")
      }).catch(function(e){
        if(e === "Failed to start session"){
          assert(false)
        }else{
          assert(true)
        }
      }).then(function(){
        // Bắt đầu phiên đấu giá từ tài khoản 0
        return auctionInstance.startSession({from:accounts[0]})
      }).then(function(){
        // Kiểm tra trạng thái của phiên đấu giá có phải Started hay không
        return auctionInstance.state({from:accounts[1]})
      }).then(function(result){
        assert.equal(result,1,"")
      })
    });

    it('This action is only available in Created State', function(){
      // Kiểm tra xem đang Started thì có bắt đầu phiên đấu giá đc hay ko
      // Gọi lại hàm startSession từ tài khoản 0
      return auctionInstance.startSession({from:accounts[0]})
      .then(function(){
        // Kiểm tra xem có tạo ra lỗi hay không
        throw("Failed to start session")
      }).catch(function(e){
        if(e === "Failed to start session"){
          assert(false)
        }else{
          assert(true)
        }
      })
    });
  });

  describe('Bid', function(){
    it('All the Bidders can bid', function(){
      // Kiểm tra xem các tài khoản đã đăng ký là 1 và 2 có thể đấu giá đc hay không
      return auctionInstance.bid(55, {from:accounts[1]})
      .then(function(){
        return auctionInstance.currentPrice({from:accounts[0]})
      }).then(function(result){
        assert.equal(result, 55, "")
      }).then(function(){
        return auctionInstance.bid(60, {from:accounts[2]})
      }).then(function(){
          return auctionInstance.currentPrice({from:accounts[0]})
      }).then(function(result){
          assert.equal(result, 60, "")
      })
      
    })
    it('This action is only available in Started State', function(){
      // Kiểm tra xem phiên đấu giá đang trong trạng thái Started thì có bid đc không từ tài khoản 3
      return auctionInstance.state({from:accounts[0]})
      .then(function(result){
        assert.equal(result,1,"")
      }).then(function(){
        return auctionInstance.bid(65,{from:accounts[3]})
      }).then(function(){
        return auctionInstance.currentPrice({from:accounts[0]})
      }).then(function(result){
        assert.equal(result,65,"")
      })
    });

    it('The next price must be inputted', function(){
      // Bid nhưng ko thêm giá tiếp theo từ tài khoản 1 
      return auctionInstance.bid({from:accounts[1]})
      .then(function(){
        // Kiểm tra xem có tạo ra lỗi hay ko
        throw("Failed to bid")
      }).catch(function(e){
        if(e === "Failed to bid"){
          assert(false)
        }else{
          assert(true)
        }
      })
    });

    it('The next price must higher than the latest price plus the minimum step (set in rule)', function(){
      // bid từ tài khoản 1 với giá là 70
      return auctionInstance.bid(70,{from:accounts[1]})
      .then(function(){
        return auctionInstance.currentPrice({from:accounts[0]})
      }).then(function(result){
        assert.equal(result,70, "")
      }).then(function(){
        // bid từ tài khoản 2 với giá là 60 < giá hiện tại là 70
        return auctionInstance.bid(60,{from:accounts[2]})
      }).then(function(){
        // Kiểm tra xem có tạo ra lỗi hay ko
        throw("Failed to bid")
      }).catch(function(e){
        if(e === "Failed to bid"){
          assert(false)
        }else{
          assert(true)
        }
      })
    });
  });

  describe('Announce', function(){
    it('Only the Auctioneer can Announce', function(){
      // Thông báo từ account 0  
      return auctionInstance.announce({from:accounts[0]})
      .then(function(){
        // Kiểm tra xem đã thông báo thành công từ account 0 chưa 
        return auctionInstance.announcementTimes({from:accounts[1]})
      }).then(function(result){
        assert.equal(result,1,"")
      })
      .then(function(){
        // Thông báo từ account 1 xem có xảy ra lỗi hay ko
        return auctionInstance.announce({from:accounts[1]})
      }).then(function(){
        throw("Failed to announce")
      }).catch(function(e){
        if(e === "Failed to announce"){
          assert(false)
        }else{
          assert(true)
        }
      })
    
    }); 

    it('After 3 times (4th call of this action), the session will end', function(){
      // Thông báo từ account 0 (4 lần) 
      return auctionInstance.announce({from:accounts[0]})
      .then(function(){
        return auctionInstance.announce({from:accounts[0]})
      }).then(function(){
        return auctionInstance.announce({from:accounts[0]})
      }).then(function(){
        return auctionInstance.announcementTimes({from:accounts[1]})
      }).then(function(result){
        assert.equal(result,3,"")
        return auctionInstance.state({from:accounts[1]})
      })
      // Kiểm tra xem trạng thái đã chuyển sang Closing chưa
      .then(function(result){
        assert.equal(result,2,"")
      })
    });

    it('This action is only available in Started State', function(){
      // Kiểm tra trạng thái hiện tại là Closing
      return auctionInstance.state({from:accounts[0]})
      .then(function(result){
        assert.equal(result,2,"")
      }).then(function(){
        // Thông báo từ account 0
        return auctionInstance.announce({from:accounts[0]})
      }).then(function(){
        // Kiểm tra xem có tạo ra lỗi ko
        throw("Failed to announce")
      }).catch(function(e){
        if(e === "Failed to announce"){
          assert(false)
        }else{
          assert(true)
        }
      })
    });

  });

  describe('Get back the deposit', function(){
    it('All the Bidders (except the Winner) can Get back the deposit', function(){
      // Winner là account 1 
      // Lấy lại tiền cọc từ account 1
      return auctionInstance.getDeposit({from:accounts[1]})
      .then(function(){
        // Kiểm tra xem có tạo ra lỗi ko
        throw("Failed to get deposit")
      }).catch(function(e){
        if(e === "Failed to get deposit"){
          assert(false)
        }else{
          assert(true)
        }
      }).then(function(){
        // Lấy lại tiền cọc từ account 2
        return auctionInstance.getDeposit({from:accounts[2]})
      })
      .then(function(){
        // Kiểm tra xem đã lấy tiền cọc thành công chưa
        return auctionInstance.bidders(accounts[2],{from:accounts[0]})
      }).then(function(result){
        assert.equal(result[1],0,"")
      })
    });

    it('This action is only available in Closing State', function(){
      // Lấy lại cọc từ account 3 
      // Sau khi tất cả account láy lại cọc thì trạng thái chuyển sang Closed 
      return auctionInstance.getDeposit({from:accounts[3]})
      .then(function(){
        return auctionInstance.getDeposit({from:accounts[2]})
      }).then(function(){
        // Kiểm tra xem có tạo ra lỗi ko
        throw ("Failed to get deposit")
      }).catch(function(e){
        if(e === "Failed to get deposit"){
          assert(false)
        }else{
          assert(true)
        }
      })
      
      
    });
  });


});