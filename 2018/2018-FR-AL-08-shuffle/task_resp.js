function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         initState: [4, 1, 3, 0, 2],
         solutionHash: 51,
         widthPlace: 120,
         text: "La transposition est une méthode de chiffrement qui consiste à mélanger les mots du message",
         cx: 290,
         minTaskW: 600,
         maxTaskW: 900
      },
      medium: {
         initState: [6, 2, 5, 4, 1, 3, 0, 7],
         solutionHash: 303,
         widthPlace: 90,
         text: "Une autre methode possible pour chiffrer un texte consiste a remplacer chaque lettre par une autre",
         cx: 290,
         minTaskW: 600,
         maxTaskW: 900
      },
      hard: {
         initState: [9, 4, 1, 5, 3, 8, 6, 2, 0, 7],
         solutionHash: 662,
         widthPlace: 76,
         text: "deposez vos cles votre ordi et votre telephone éteint dans le coffre et attendez Alice et Bob qui sont partis acheter du lait du pain et du fromage avec Eve",
         cx: 290,
         minTaskW: 600,
         maxTaskW: 900
      }
   };
   var paper;
   var paperW = 770;
   var paperH;
   var heightPlacePerLetter = 30;
   var fontSize = 12;
   var xMargin = 100;
   var selectedWord = 0;
   var nbWords = 0;
   var blockLength;
   var initState;

   subTask.loadLevel = function(curLevel) {
      displayHelper.avatarType = "laptop";
      level = curLevel;
      if(Beav.Navigator.supportsResponsive()){
         displayHelper.responsive = true;
      }else{
         displayHelper.responsive = false;
      }
      displayHelper.thresholdEasy = 120;
      displayHelper.thresholdMedium = 180;

      initState = data[level].initState.slice();
      blockLength = initState.length;
      nbWords = Math.floor(data[level].text.split(" ").length / blockLength);
      heightPlace = heightPlacePerLetter * nbWords;
      selectedWord = 0;
      paperH = heightPlace + 10;

      displayHelper.minTaskW = data[level].minTaskW;
      displayHelper.maxTaskW = data[level].maxTaskW;
      displayHelper.taskH = paperH;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
   };

   subTask.resetDisplay = function() {
      initPaper();
      // $(".blockLength").html(blockLength);
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = initState.slice();
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   var drawSticker = function(iSticker, type) {
      var margin = 0;
      var message = "";
      for (var iWord = 0; iWord < nbWords; iWord++) {
         if (iWord != 0) {
            message += "\n \n";
         }
         var letter = data[level].text.split(" ")[iWord * blockLength + iSticker];
         if (letter == " ") {
            letter = "\u00a0";
         }
         message += letter;
      }
      var sticker = paper.text(0, 0, message.toUpperCase()).attr({"font-family":"courier-new"});
      sticker.attr({"font-size": fontSize});
      var rect1 = paper.rect(-data[level].widthPlace/2, -heightPlace/2, data[level].widthPlace, heightPlace).attr({fill: "#E0E0F8"});
      var rect2 = paper.rect(margin-data[level].widthPlace/2, margin-heightPlace/2, data[level].widthPlace-2*margin, heightPlace-2*margin).attr({fill: "white"});
      return [rect1, rect2, sticker];
   }

   var initPaper = function() {
      if (paper != null) {
         paper.remove();
      }
      paper = subTask.raphaelFactory.create("anim","anim",paperW,paperH);

      dragAndDrop = DragAndDropSystem({
         displayHelper: displayHelper,
         paper : paper,
         actionIfEjected: function(refElement, srcCont, srcPos) {
            var sequence = dragAndDrop.getObjects(srcCont);
            for (var iPos = 0; iPos < sequence.length; iPos++) {
               if (sequence[iPos] === null) {
                  return DragAndDropSystem.action(srcCont, iPos, "insert");
               }
            }
            return null;
         },
         drop: function(srcCont, srcPos, dstCont, dstPos, type) {
            answer = dragAndDrop.getObjects('alien');
         },
         ejected: function(refElement, srcCont, srcPos) {
         }
      });

     var backgroundAlien = paper.rect(-data[level].widthPlace/2,-heightPlace/2,data[level].widthPlace,heightPlace).attr('fill', '#F2F2FF');

      dragAndDrop.addContainer({
         ident : 'alien',
         cx : data[level].cx + xMargin,
         cy : heightPlace / 2,
         widthPlace : data[level].widthPlace,
         heightPlace : heightPlace,
         nbPlaces : blockLength,
         direction : 'horizontal',
         dropMode : 'insertBefore',
         dragDisplayMode : 'preview',
         placeBackgroundArray : [ backgroundAlien ]
      });

      for (var pos = 0; pos < blockLength; pos++) {
         var iSticker = answer[pos];
         dragAndDrop.insertObject('alien', pos, {ident : iSticker, elements : drawSticker(iSticker, "alien")} );
      }
   }

   var hashSequence = function(sequence) {
      var primes = [1, 2, 3, 5, 7, 11, 13, 17, 19, 23];
      var sum = 0;
      for (var iVal = 0; iVal < sequence.length; iVal++) {
         sum += sequence[iVal] * primes[iVal];
      }
      return sum;
   }

   function getResultAndMessage () {
      if (Beav.Object.eq(answer, initState)) {
         return {
            successRate: 0,
            message: "Déplacez les étiquettes pour les mettre dans le bon ordre."
         }
      }
      var hash = hashSequence(answer);
      if (hash == data[level].solutionHash) {
         return {
            successRate: 1,
            message: "Bravo, vous avez réussi."
         }
      } else {
         return {
            successRate: 0,
            message: "Vous avez au moins une erreur."
         }
      }
   };

};
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
