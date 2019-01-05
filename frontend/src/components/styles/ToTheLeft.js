import posed from "react-pose";

const ToTheLeft = posed.div({
  enter: {
    x: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 300,
      ease: "easeIn"
    }
  },
  exit: {
    x: "-50%",
    opacity: 0,
    transition: {
      type: "tween",
      duration: 300,
      ease: "easeIn"
    }
  }
});

export default ToTheLeft;
