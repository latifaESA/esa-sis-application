import styled from "styled-components";

export const Wrapper = styled.div`
  border: 1px solid;
  /* height: 99vh; */
  padding: 10px;
  padding-bottom: 30px;
`;

export const StyledEvent = styled.div`
  background: ${({ bgColor }) => bgColor};
  color: white;
  text-align: left !important;
  padding: 2px 10px;
  margin: 0 2px;
  border-radius: 10px;
  font-size: 13px;
  cursor: move;
  text-transform: capitalize;
  display: flex;
  flex-direction: column;
  align-items: center;

  div[name="arrows"]{
    display: flex;
    justify-content: space-around;
  }

  div[name="arrows"] #left, div[name="arrows"] #right{
    transition: all 0.3s;
  }

  div[name="arrows"] #left:hover, div[name="arrows"] #right:hover{
    height: 40px;
    width: 40px;
  }

  div{
    display: flex;
    justify-content: center;
    font-size: 19px;
  }

  div[name="actors"]{
    display: flex;
    justify-content: space-between;
  }

  span[name="edit"]{
    border-radius: 10px;
    padding: 10px;
    background: green;
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  span[name="delete"]{
    border-radius: 10px;
    padding: 10px;
    background: red;
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  span[name="edit"]:hover{
    opacity: 0.8;
  }

  span[name="delete"]:hover{
    opacity: 0.8;
  }



`;

export const SevenColGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  ${(props) => props.fullheight && `height: calc(100% - 75px);`}
  ${(props) =>
    props.fullheight &&
    `grid-template-rows: repeat(${props.is28Days ? 4 : 5}, 1fr);`}
  div {
    display: grid;
    justify-content: space-around;
    border: 1px solid;
    // ${StyledEvent} {
    //   display: none;
    // }
    // ${StyledEvent}:nth-child(-n + 3) {
    //   display: block;
    // }

    span {
      text-align: right;
      padding-right: 15px;
      height: fit-content;
      cursor: pointer;
    }

    span.active {
      background-color: pink;
      border-bottom: 2px solid red;
      position: relative;
    }
    span.active::before {
      content: "Today ";
      font-size: 14px;
    }
  }
`;

export const HeadDays = styled.span`
  text-align: center;
  border: 1px solid;
  height: 30px;
  padding: 5px;
  background: #0ba388;
  color: white;
`;

export const DateControls = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  align-items: center;

  button {
    font-size: 1.6rem;
    cursor: pointer;
  }
`;

export const SeeMore = styled.p`
  font-size: 12px;
  padding: 0 5px;
  margin-bottom: 0;
  cursor: pointer;
`;

export const PortalWrapper = styled.div`
  background: white;
  position: fixed;
  width: 60%;
  // height: 200px; 
  top: 50%;
  left: 50%;
  /* border: 1px solid; */
  border-radius: 6px;
  transform: translate(-50%, -50%);
  box-shadow: 10px 10px 20px black;
  padding: 40px;

  h2 {
    font-size: 3rem;
  }

  button {
    font-size: 2rem;
    color: red;
    background: white;
    padding: 10px 20px;
    border-radius: 6px;
  }

  p {
    margin-bottom: 15px;
  }

  button[name="close-outline"] {
    position: absolute;
    top: 10px;
    right: 10px;
    background: red;
    color: white;
  }
`;


export const ScheduleForm = styled.div`
background: white;
position: fixed;
top: 50%;
left: 50%;
border-radius: 6px;
transform: translate(-50%, -50%);
box-shadow: 0px 2px 5px black;
padding: 20px;
height: 60vh;
overflow-y: auto;
display: flex;
flex-direction: column;
p {
  margin-bottom: 15px;
}

input {
  margin-bottom: 15px;
}

`