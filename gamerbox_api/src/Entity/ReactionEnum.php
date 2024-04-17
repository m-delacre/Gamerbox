<?php

namespace App\Entity;

enum ReactionEnum: string
{
    case like = 'like';
    case mitigate = 'mitigate';
    case dislike = 'dislike';
}
