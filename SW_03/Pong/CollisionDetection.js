function objectsCollide(obj, other) {
  // object collides with other object which is above
  if (
    (obj.upperBound >= other.lowerBound &&
      obj.lowerBound <= other.lowerBound &&
      obj.leftBound >= other.leftBound &&
      obj.leftBound <= other.rightBound) ||
    (obj.upperBound >= other.lowerBound &&
      obj.lowerBound <= other.lowerBound &&
      obj.rightBound <= other.rightBound &&
      obj.rightBound >= other.leftBound)
  ) {
    return true;
  }
  // object collides with other object which is to the left
  if (
    (obj.leftBound <= other.rightBound &&
      obj.rightBound >= other.rightBound &&
      obj.upperBound <= other.upperBound &&
      obj.upperBound >= other.lowerBound) ||
    (obj.leftBound <= other.rightBound &&
      obj.rightBound >= other.rightBound &&
      obj.lowerBound >= other.lowerBound &&
      obj.lowerBound <= other.upperBound)
  ) {
    return true;
  }

  // object collides with other object which is below
  if (
    (obj.lowerBound <= other.upperBound &&
      obj.upperBound >= other.upperBound &&
      obj.leftBound >= other.leftBound &&
      obj.leftBound <= other.rightBound) ||
    (obj.lowerBound <= other.upperBound &&
      obj.upperBound >= other.upperBound &&
      obj.rightBound <= other.rightBound &&
      obj.rightBound >= other.leftBound)
  ) {
    return true;
  }

  // object collides with other object which is to the right
  if (
    (obj.rightBound >= other.leftBound &&
      obj.leftBound <= other.leftBound &&
      obj.upperBound <= other.upperBound &&
      obj.upperBound >= other.lowerBound) ||
    (obj.rightBound >= other.leftBound &&
      obj.leftBound <= other.leftBound &&
      obj.lowerBound >= other.lowerBound &&
      obj.lowerBound <= other.upperBound)
  ) {
    return true;
  }
  return false;
}
