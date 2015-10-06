;(function(){

  const setOptions = function(optionsObject, defaultKeyValues) {

    for (let key in defaultKeyValues) {
      if (!optionsObject.hasOwnProperty(key)) {
        optionsObject[key] = defaultKeyValues[key]
      }
    }

    return optionsObject
  }

  const buildTextbox = function(opts) {
    let $tb = $("<div class='textbox js-textbox'>")
    $(opts.selector).html($tb)

    let charArray = false
    
    const setString = function(string) {
      $tb.empty()

      if (string.length === 0) {
        return false
      }
      
      let charArray = []
      const words = opts.string.split(" ")

      words.forEach(function(word, i){
        let $word = $("<div class='textbox-word'>")
        
        const characters = word.split("")
        characters.forEach(function(character){
          let $character = $("<span class='textbox-character'>")
          $character.text(character)
          $word.append($character)
          charArray.push($character)
        })

        if ((i + 1) < words.length) {
          let $character = $("<span class='textbox-character textbox-space'>")
          $character.html(opts.spaceCharacter)
          $word.append($character)
          charArray.push($character)
        }
        $tb.append($word)
      })

      return charArray
    }

    const highlightPosition = function(position) {
      if (charArray) {
        charArray.forEach(function($char){
          $char.removeClass("textbox-active")
        })

        charArray[position].addClass("textbox-active")
      }
    }

    const endHighlight = function() {
      if (charArray) {
        charArray.forEach(function($char){
          $char.removeClass("textbox-active")
        })
      }
    }

    charArray = setString(opts.string)
    highlightPosition(0)

    return {
      $tb: $tb,
      setString: function(string) {
        charArray = setString(string)
        highlightPosition(0)
      },
      highlightPosition: highlightPosition,
      endHighlight: endHighlight
    }
  }

  const resetState = function(opts) {
    return {
      position: 0,
      string: opts.string,
      next: opts.string[0] || false,
      started: false,
      complete: false
    }
  }

  const Textbox = function(selector, opts) {
    opts = setOptions(opts, {
      string: "",
      selector: selector,
      spaceCharacter: "&nbsp;"
    })

    let instance = buildTextbox(opts)

    let state = resetState(opts)
    
    let textbox = {

      state: function() {
        return state
      },

      reset: function(string) {
        if (string !== undefined) {
          opts.string = string
        }

        instance.setString(string)
        state = resetState(opts)
      },

      applyCharacter: function(character) {
        if (!state.string) {
          return { started: false }
        }

        if (state.complete) {
          return { complete: true }
        }

        state.started = true
        if (state.next !== character) {
          return { 
            accurate: false, 
            complete: false, 
            next: state.next 
          }
        }

        state.position++
        state.next = state.string[state.position]
        if (state.next === undefined) {
          state.complete = true
          instance.endHighlight()
          return {
            accurate: true,
            complete: true,
            next: false
          }
        }

        instance.highlightPosition(state.position)

        return { 
          accurate: true, 
          complete: false,
          next: state.next 
        }
      }

    }

    return textbox

  }

  const PackageDefinition = Textbox
  const PackageName = "Textbox"

  if ("undefined" !== typeof(exports)) module.exports = PackageDefinition
  else if ("function" === typeof(define) && define.amd) {
    define(PackageName, function() { return PackageDefinition })
  } else {
    window[PackageName] = PackageDefinition
  }

})()