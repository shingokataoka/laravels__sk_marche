import React from "react"

export default function nl2br(str) {
		// まず、　[`文字列` , <br/>, '文字列']な配列にする（<br/>は文字列にできないから）。
		// それをループでJSXにして返す。（<br/>を含む文字列にできないので、JSX形式で返す）
    const texts = str.split(/(\n)/).map((item, index) => {
      return (
        <React.Fragment key={index}>
          { item.match(/\n/) ? <br /> : item }
        </React.Fragment>
      )
    })
    return texts
  }
