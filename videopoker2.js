//GLOBALS
var deals = 0;
var playerHand = [];
var showVal = 'cash';

//GET ID FUNCTION
function getId(id) {
  return document.getElementById(id);
}

//RESET VARIABLES FUNCTION
function reset() {
  playerHand = [];
  playerHand.length = 5;
  for (var x in playerHand) {
    playerHand[x].saved = false;
    playerHand[x].yellow = false;
  }
}
reset();

//DECK OBJECT
var deck = {
  deckNumbers: [1,2,3,4,5,6,7,8,9,10,11,12,13],
  deckSuits: [1,2,3,4],
  deckCards: [],

//SHUFFLE = MAKE DECK.DECKCARDS AND SHUFFLE THEM
  shuffle: function() {
    deckCards = [];
//CARD CONSTRUCTOR
    function Card(value, suit) {
      this.value = value;
      this.suit = suit;
    }
//A IS FOR COUNTING
    var a = 0;
//IN EACH SUIT, RUN EACH NUMBER TO CREATE CARDS
    for (var i in this.deckSuits) {
      for (var j in this.deckNumbers) {
        this.deckCards[a] = new Card(this.deckNumbers[j], this.deckSuits[i]);
        a++;
      }
    }
//START SHUFFLE
    var k = this.deckCards.length;
    if (k === 0) {
      return false;
    }
    else {
      while (--k) {
         var m = Math.floor(Math.random() * ( k + 1 ));
         var tempi = this.deckCards[k];
         var tempj = this.deckCards[m];
         this.deckCards[k] = tempj;
         this.deckCards[m] = tempi;
      }
    }
  }
}

//RUN DECK SHUFFLE BEFORE HAND IS CREATED
deck.shuffle();

var hand = {
  //MAKE PLAYERHAND
  makeHand: function() {
    function clearCards() {
      getId('c' + p + 'topleft').innerHTML = '';
      getId('c' + p + 'topsymbol').innerHTML = '';
      getId('c' + p + 'symbol').innerHTML = '';
      getId('c' + p + 'head').innerHTML = '';
      getId('c' + p).style.backgroundImage = "url('images/cardback.png')";
    }
    //PULL 1ST 5 CARDS FOR 1ST DEAL
    if (deals === 0) {
      playerHand = deck.deckCards.splice(0, 5);
      deals = 1;

      //CLEAR ALL CARDS FACES
      for (var p in playerHand) {
        clearCards();
      }
    }
    //SECOND DEAL
    else if (deals === 1) {
      for (var p in playerHand) {
        if (playerHand[p].saved !== true) {
          //PULL NEW CARDS IF NOT SAVED
          playerHand[p] = deck.deckCards.pop();
          clearCards();
        }
      }
      deals = 0;
    }
  },
  //GETS VALUE B FROM DEAL.RUNLOOP
  showHand: function(b) {
    //CHANGE CARD FACE VALUE IF NEEDED
    switch (playerHand[b].value) {
      case 1:
        faceValue = 'A';
        break;
      case 11:
        faceValue = 'J';
        break;
      case 12:
        faceValue = 'Q';
        break;
      case 13:
        faceValue = 'K';
        break;
      default:
        faceValue = playerHand[b].value;
    }
    //SUIT PICTURE
    switch (playerHand[b].suit) {
      case 1:
        faceSuit = 'S';
        getId('c' + b + 'symbol').innerHTML = '<img src="images/spades.png" alt="spades">';
        break;
      case 2:
        faceSuit = 'C';
        getId('c' + b + 'symbol').innerHTML = '<img src="images/clubs.png" alt="clubs">';
        break;
      case 3:
        faceSuit = 'D';
        getId('c' + b + 'symbol').innerHTML = '<img src="images/diamonds.png" alt="diamonds">';
        break;
      case 4:
        faceSuit = 'H';
        getId('c' + b + 'symbol').innerHTML = '<img src="images/hearts.png" alt="hearts">';
        break;
    }
    //CHANGE CARD FACE
    getId('c' + b).style.backgroundImage = 'none';
    getId('c' + b + 'topleft').innerHTML = faceValue;
  }
};

var deal = {
  highlightAll: function(color) {
    for (i = 0; i < 5; i++) {
      getId('c' + i).style.backgroundColor = color;
      if (color === 'yellow') {
        playerHand[i].yellow = true;
      }
    }
  },
  runIt: function(c) {
    //VARS FOR CHECKHAND FUNCTION
    var isFlush = 0;
    var isStraight = 0;
    var matches = 0;
    var bottomCard = null;
    var topCard = null;
    var isStraight = [];
    var straight = false;
    deal.highlightAll('white');
    var pairValue = [];
    getId('print').innerHTML = '';
    //C FOR COUNTING LOOP
    function runLoop(c) {
      if (c === 0) {
        hand.makeHand();
      }
      if (c < 5) {
        if (playerHand[c].saved !== true) {
          setTimeout(function() {
            hand.showHand(c);
            c++;
            runLoop(c);
          },200);
        }
        else {
          hand.showHand(c);
          c++;
          runLoop(c);
        }
      }
      else {
        checkHand();
        if (deals === 0) {
           getId('draw').innerHTML = 'DEAL';
        }
        else {
          getId('draw').innerHTML = 'DRAW';
        }
      }
    }
    function checkHand() {
      //MAKE COPY FOR PAIRS CHECK
      var playerHandCopy = playerHand;
      for (var i in playerHand) {
        isStraight.push(playerHand[i].value);

        //PAIRS CHECK
        for (var j in playerHandCopy) {
          if (playerHandCopy[j].value === playerHand[i].value && i !== j) {
            getId('c' + j).style.backgroundColor = 'yellow';
            playerHand[i].yellow = true;
            pairValue.push(playerHandCopy[j].value);
            matches++;
          }
        }

        //FLUSH CHECK
        if ( i > 0 ) {
          if (playerHand[i].suit === playerHand[i-1].suit) {
            isFlush++;
          }
        }
        //END FLUSH CHECK
      }

      //STRAIGHT CHECK - ISSTRAIGHT CREATED IN LOOP ABOVE
      bottomCard = Math.min.apply(null, isStraight);
      topCard = Math.max.apply(null, isStraight);
      function straightCheck() {
        switch (true) {
          //CHANGE ACE TO HIGH IF NEEDED AND RUN AGAIN
          case (bottomCard === 1 && matches === 0):
            if (topCard === 13) {
              isStraight[isStraight.indexOf(1)] = 14;
              bottomCard = Math.min.apply(null, isStraight);
              topCard = 14;
              straightCheck();
              break;
            }
            else {
              if (bottomCard === (topCard - 4) && matches === 0) {
                straight = true;
              }
            }
          break;
          case (bottomCard === (topCard - 4) && matches === 0):
            straight = true;
            break;
        }
      }
      //END STRAIGHT CHECK - RUN IT
      straightCheck();
      switch (true) {
        case (isFlush ===  4 && straight === true):
          deal.highlightAll('yellow');
          if (topCard === 14) {
            if (deals === 0) {
              if (user.bet !== 5) {
                user.payThem(250);
              }
              else {
                user.payThem(800);
              }
            }
            getId('print').innerHTML = 'ROYAL FLUSH!!!';
            user.highlightRow(1);
          }
          else {
            if (deals === 0) {
              user.payThem(50);
            }
            getId('print').innerHTML = 'STRAIGHT FLUSH!!';
            user.highlightRow(2);
          }
          break;
        case (isFlush === 4):
          if (deals === 0) {
            user.payThem(6);
          }
          deal.highlightAll('yellow');
          getId('print').innerHTML = 'FLUSH';
          user.highlightRow(5);
          break;
        case (straight === true):
          if (deals === 0) {
            user.payThem(4);
          }
          deal.highlightAll('yellow');
          getId('print').innerHTML = 'STRAIGHT';
          user.highlightRow(6);
          break;
        case (matches === 2):
          if (pairValue[0] > 10 || pairValue[0] === 1) {
            if (deals === 0) {
              user.payThem(1);
            }
            getId('print').innerHTML = 'JACKS OR BETTER';
            user.highlightRow(9);
          }
          else {
            deal.highlightAll('white');
            for (var w in playerHand) {
              playerHand[w].yellow = false;
            }
          }
          break;
        case (matches === 4):
          if (deals === 0) {
            user.payThem(2);
          }
          getId('print').innerHTML = 'TWO PAIR';
          user.highlightRow(8);
          break;
        case (matches === 6):
          if (deals === 0) {
            user.payThem(3);
          }
          getId('print').innerHTML = '3 OF A KIND';
          user.highlightRow(7);
          break;
        case (matches === 8):
          if (deals === 0) {
            user.payThem(9);
          }
          getId('print').innerHTML = 'FULL HOUSE';
          user.highlightRow(4);
          break;
        case (matches === 12):
          if (deals === 0) {
            user.payThem(25);
          }
          getId('print').innerHTML = '4 OF A KIND';
          user.highlightRow(3);
          break;
      }
      if (deals === 0) {
          getId('playMax').style.visibility = 'visible';
      };
    }
    runLoop(c);
  }
};
//USER OBJECT - MONEY
var user = {
  money: 400,
  bet: 1,
  changeBet: function() {
    if (deals === 0) {
      if (user.bet < 5) {
        user.bet++;
      }
      else {
        user.bet = 1;
      }
    }
    getId('bet').innerHTML = 'Bet : ' + user.bet;
    switch (user.bet) {
      case (1):
        getId('betOne').innerHTML = 'BET 2';
        break;
      case (2):
        getId('betOne').innerHTML = 'BET 3';
        break;
      case (3):
        getId('betOne').innerHTML = 'BET 4';
        break;
      case (4):
        getId('betOne').innerHTML = 'BET 5';
        break;
      case (5):
        getId('betOne').innerHTML = 'BET 1';
        break;    
    }
    user.highlightBet();
  },
  maxBet: function() {
    if (deals === 0) {
      user.bet = 5;
      getId('bet').innerHTML = 'Bet : ' + user.bet;
      getId('betOne').innerHTML = 'BET 1';
      user.highlightBet();
    }
  },
  highlightBet: function() {
    var makeRed = user.bet + 1;
    var row;
    for (var column = 2; column < 7; column++) {
      if (column === makeRed) {
        for (row = 1; row < 10; row++) {
            getId('x' + makeRed + 'y' + row).style.backgroundColor = 'red';
        }
      }
      else {
        for (var row = 1; row < 10; row++) {
            getId('x' + column + 'y' + row).style.backgroundColor = 'blue';
        }
      }
    }
  },
  highlightRow: function(payRow) {
    for (var showCol = 1; showCol < 7; showCol++) {
      for (var showRow = 1; showRow < 10; showRow++) {
        if (getId('x' + showCol + 'y' + showRow).style.backgroundColor === 'darkblue') {
          getId('x' + showCol + 'y' + showRow).style.backgroundColor = 'blue';
        }
        if (payRow !== 0) {
          if (showRow === payRow) {
            getId('x' + showCol + 'y' + showRow).style.backgroundColor = 'darkblue';
          }
        }
        else {
          getId('x' + showCol + 'y' + showRow).style.backgroundColor = 'blue';
        }
      }
    }
    if (payRow === 0) {
      user.highlightBet();
    }
  },
  payThem: function(winnings) {
    winnings *= user.bet;
    getId('win').innerHTML = 'WIN ' + winnings;
    function paySlow() {
      if (winnings > 0) {
        setTimeout(function() {
          user.money++;
          user.showMoney();
          winnings--;
          paySlow();
        }, 100);
      }
    }
    paySlow();
  },
  showMoney: function() {
    if (showVal === 'credits') {
      getId('money').innerHTML = 'Credits ' + user.money;
    }
    else {
      var cash = user.money * .25;
      cash = cash.toFixed(2);
      getId('money').innerHTML = '$' + cash;
    }
  }
};
window.onload = function() {
  getId('money').innerHTML = '$100.00';
  getId('betOne').addEventListener('click', function() {user.changeBet();})
  getId('maxBet').addEventListener('click', function() {user.maxBet();})
  getId('bet').innerHTML = 'Bet : ' + user.bet;
  getId('money').addEventListener('click', function() {
    if (showVal === 'cash') {
      showVal = 'credits';
    }
    else {
      showVal = 'cash';
    }
    user.showMoney();
  })
  getId('c0').addEventListener('click', function() {saveCard(0);});
  getId('c1').addEventListener('click', function() {saveCard(1);});
  getId('c2').addEventListener('click', function() {saveCard(2);});
  getId('c3').addEventListener('click', function() {saveCard(3);});
  getId('c4').addEventListener('click', function() {saveCard(4);});
  getId('draw').addEventListener('click', function() {
    getId('playMax').style.visibility = 'hidden';
    if (deals === 0  && (user.money - user.bet >= 0)) {
      reset();
      for (var h = 0; h < 5; h++) {
        getId('c' + h + 'held').innerHTML = '';
      }
      deck.shuffle();
      user.money -= user.bet;
      user.showMoney();
      getId('win').innerHTML = '';
      user.highlightRow(0);
      deal.runIt(0);
    }
    else if (deals === 1) {
      user.highlightRow(0);
      deal.runIt(0);
    }
    else {
      alert('Out of Money. Reduce Your Bet or Refresh the Page to Start Over');
    }
  });
  function saveCard(card) {
    if (deals === 1  && playerHand[card].saved !== true) {
      getId('c' + card).style.backgroundColor = 'lightblue';
      getId('c' + card + 'held').innerHTML = 'HELD';
      playerHand[card].saved = true;
    }
    else if (deals === 1 && playerHand[card].saved === true) {
      if (playerHand[card].yellow === true) {
        getId('c' + card).style.backgroundColor = 'yellow';
      }
      else {
        getId('c' + card).style.backgroundColor = 'white';
      }
      getId('c' + card + 'held').innerHTML = '';
      playerHand[card].saved = false;
    }
    else {
      return;
    }
  }
};
