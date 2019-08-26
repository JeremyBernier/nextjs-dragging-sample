import React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import Head from 'next/head'
import Nav from '../components/nav'
import fetch from 'isomorphic-unfetch'
import Module from '../components/module'
import "../styles/index.css"
import { fetchModuleData } from '../store'

const Home = ({ moduleList = [], moduleMap = {}, fetchModuleData }) => (
  <div>
    <Head>
      <title>Home</title>
    </Head>

    <Nav />

    <main>

      <h1>Modules</h1>
      {moduleList.map((moduleId) => (
        <Module key={moduleId} moduleData={moduleMap[moduleId]} />
      ))}

      <div className="bottom-section">
        <div className="btn-reload" onClick={() => fetchModuleData()}>
          <span className="btn-reload-text">Reload Content</span>
          <img src="/static/svg/archive icon.svg" />
        </div>
      </div>

    </main>

    <style jsx>{`
      main {
        margin: 0 auto;
        max-width: 1000px;
        padding: 0 1rem;
      }

      h1 {
        font-size: 18px;
        margin-bottom: 2rem;
      }

      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }

      .bottom-section {
        margin-bottom: 5rem;
      }

      .btn-reload {
        background-color: #0033FF;
        color: white;
        max-width: 163px;
        padding: .8rem .8rem;
        text-align: center;
        margin-left: auto;
        cursor: pointer;
      }

      .btn-reload-text {
        margin-right: 1rem;
      }
    `}</style>
  </div>
)

Home.getInitialProps = async ({ store, req }) => {
  await store.dispatch(fetchModuleData())
}

/*Home.getInitialProps = ({ store }) => {
  return store.dispatch(fetchModuleData())
}*/

const mapStateToProps = (state) => ({
  moduleList: state.moduleList,
  moduleMap: state.moduleMap,
})

const mapDispatchToProps = { fetchModuleData }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
