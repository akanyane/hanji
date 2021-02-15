import React from 'react'
import './style.css'

export default function Card(props) {
    return (
        <div className="card">
          <div className="card-hangul">{props.hangul}</div>
          <div className="card-romanization">{props.romanization}</div>
          <div className="card-type">{props.type}</div>
          <div className="id">{props.id}</div>
        </div>
    )
}
