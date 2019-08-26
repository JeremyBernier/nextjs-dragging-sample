import React from 'react'
import Link from 'next/link'
import { toggleModuleActive, updateLessonsOrder, updateDraggedItem } from '../store'
import { connect } from 'react-redux'

function onDragStart (evt, callback) {
  callback()
  //this.draggedItem = this.state.items[index];
  evt.dataTransfer.effectAllowed = "move";
  evt.dataTransfer.setData("text/html", evt.target.parentNode);
  evt.dataTransfer.setDragImage(evt.target.parentNode, 20, 20);
}

function onDragOver (index, draggedItem, callback) {
  if (draggedItem === index) {
    return;
  }
  callback()
}

const Module = ({ moduleData: { title, id }, isActive, lessons = [], toggleModuleActive,
    updateLessonsOrder, updateDraggedItem, draggedItem }) => {
  const moduleId = id

  return (
    <div className="module-container">
      <div className={`module-item${isActive ? ' active' : ''}`}>
        <div className="module-item-left">
          <img src="/static/svg/Modules.svg" className="module-icon" />
          <div>
            <h2 className="module-title">{title}</h2>
            <p className="module-description">
              Created at <time className="module-date">2019-08-25</time>
            </p>
          </div>
        </div>
        <div>
          <img className="icon-reorder" src="/static/svg/Reorder.svg" />
          <img className={`icon-expand${isActive ? ' active' : ''}`} src="/static/svg/Expand.svg" onClick={toggleModuleActive.bind(null, id)} />
        </div>
      </div>
      {isActive && (
        <ul className="lesson-list list-unstyled">
          {lessons.map(({ id, href, title }) => (
            <li
              key={id}
              className="lesson-item"
              onDragOver={() => onDragOver(id, draggedItem, () => updateLessonsOrder(id, moduleId))}
            >
              <div>
                <img className="lesson-icon" src="/static/svg/LessonIcon.svg" />
                {title}
              </div>
              <img
                draggable 
                onDragStart={(evt) => onDragStart(evt, () => updateDraggedItem(id, moduleId))}
                onDragEnd={() => updateDraggedItem(null, null)}
                className="icon-reorder" src="/static/svg/Reorder.svg"
              />
            </li>
          ))}
        </ul>
      )}
      <style jsx>{`
        .module-container {
          margin-bottom: 2.5rem;
        }
        .module-item {
          display: flex;
          justify-content: space-between;
          background-color: #F8FAFF;
          border: 1px solid #E5E5E5;
          padding-top: .8rem;
          padding-bottom: .8rem;
          padding-left: 1rem;
          font-size: 11px;
          transition: .2s background-color;
        }
        .module-item.active {
          background-color: #F8FFF8;
        }
        .module-icon {
          padding-right: 1rem;
        }
        .module-item-left {
          display: flex;
        }
        .module-title, .module-date {
          color: #0033FF;
        }
        .module-title {
          font-weight: bold;
          font-size: 15px;
          margin: 0;
        }
        .module-description {
          margin: 0;
        }
        .module-date {
          font-size: 11px;
        }

        .lesson-icon {
          margin-right: .8rem;
        }

        .lesson-item {
          display: flex;
          justify-content: space-between;
          border: 1px solid #E5E5E5;
          padding-top: .8rem;
          padding-bottom: .8rem;
          padding-left: 4rem;
          font-size: 13px;
          color: #0033FF;
        }
        .icon-reorder {
          cursor: pointer;
        }

        .icon-expand {
          cursor: pointer;
          transition: .2s transform;
        }
        .icon-expand.active {
          transform: rotate(180deg);
        }
      `}</style>
    </div>
)}

const mapStateToProps = (state, props) => {
  const { id } = props.moduleData
  return {
    isActive: state.moduleMap[id].isActive,
    lessons: state.lessonsByModuleId[id],
    draggedItem: state.draggedItem
  }
}

const mapDispatchToProps = {
  toggleModuleActive,
  updateLessonsOrder,
  updateDraggedItem
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Module)

