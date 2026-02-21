<?php

namespace parkingo\Entity;

trait ArrayAccessible
{
    public function offsetExists($offset): bool
    {
        return property_exists($this, $offset);
    }

    public function offsetGet($offset)
    {
        return $this->$offset;
    }

    public function offsetSet($offset, $value): void
    {
        if (property_exists($this, $offset)) {
            $this->$offset = $value;
        }
    }

    public function offsetUnset($offset): void
    {
        if (property_exists($this, $offset)) {
            $this->$offset = null;
        }
    }
}
